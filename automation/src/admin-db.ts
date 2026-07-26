/**
 * Privileged database connection used ONLY for test setup/teardown and for the
 * functional audit-immutability test (OQ-15). It is kept strictly separate from the
 * read-only evidence connection in audit-db.ts.
 *
 * WHY A SEPARATE, WRITE-CAPABLE CONNECTION:
 * OQ-15 must prove the audit trail rejects modification because of an ENFORCED control
 * (an immutability trigger), not merely because the connecting user lacks privilege.
 * If we attempted the tamper with the read-only role, the failure would come from a
 * missing GRANT and the test would "pass" without the real control existing. So we
 * connect with a role that WOULD otherwise be allowed to write (the application role or
 * a test admin) and confirm the write is still refused. All attempts are wrapped in a
 * transaction that is ALWAYS rolled back, so no audit data is ever actually changed.
 *
 * Configure PGADMIN_USER/PGADMIN_PASSWORD (falls back to PGUSER/PGPASSWORD).
 */
import pg from 'pg';

const { Pool } = pg;

let adminPool: pg.Pool | null = null;

function getAdminPool(): pg.Pool {
  if (!adminPool) {
    adminPool = new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT ?? 5432),
      database: process.env.PGDATABASE,
      user: process.env.PGADMIN_USER ?? process.env.PGUSER,
      password: process.env.PGADMIN_PASSWORD ?? process.env.PGPASSWORD,
      max: 2,
      idleTimeoutMillis: 5_000,
    });
  }
  return adminPool;
}

export async function closeAdminDb(): Promise<void> {
  if (adminPool) { await adminPool.end(); adminPool = null; }
}

/** Pick the most recent audit row to attempt tampering on (OQ-15). */
export async function getAnyAuditId(): Promise<number | null> {
  const res = await getAdminPool().query(
    `SELECT audit_id FROM audit_log_event ORDER BY audit_date DESC LIMIT 1;`);
  return (res.rows[0]?.audit_id as number) ?? null;
}

export interface WriteAttempt {
  operation: 'update' | 'delete';
  rejected: boolean;   // true = database refused the write (immutability control working)
  error?: string;      // the rejection message (attached as evidence)
}

/**
 * Attempt to UPDATE or DELETE an audit row and report whether the DB rejected it.
 * The statement runs inside a transaction that is ALWAYS rolled back, so even if the
 * control is missing (write succeeds) we do not actually damage the audit trail.
 */
export async function attemptAuditWrite(operation: 'update' | 'delete', auditId: number): Promise<WriteAttempt> {
  const client = await getAdminPool().connect();
  try {
    await client.query('BEGIN');
    if (operation === 'update') {
      await client.query(
        `UPDATE audit_log_event SET reason_for_change = 'OQ-15 tamper attempt' WHERE audit_id = $1;`,
        [auditId]);
    } else {
      await client.query(`DELETE FROM audit_log_event WHERE audit_id = $1;`, [auditId]);
    }
    // Reaching here means the DB ALLOWED the write -> the immutability control is MISSING.
    await client.query('ROLLBACK');
    return { operation, rejected: false };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => { /* connection may already be aborted */ });
    return { operation, rejected: true, error: e instanceof Error ? e.message : String(e) };
  } finally {
    client.release();
  }
}

/**
 * Best-effort, schema-guarded reset of a locked test account so OQ-28 is re-runnable.
 * OpenClinica 3.x marks account availability via user_account.status_id (1 = available).
 * We confirm the column exists before touching it; if the schema differs this is a no-op
 * and the account is reset manually per SOP-001. This is a TEST FIXTURE action, never an
 * operation on real study accounts.
 */
export async function resetUserLock(userName: string): Promise<{ reset: boolean; detail: string }> {
  const pool = getAdminPool();
  const col = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_name = 'user_account' AND column_name = 'status_id' LIMIT 1;`);
  if (col.rowCount === 0) {
    return { reset: false, detail: 'user_account.status_id not found; reset manually per SOP-001' };
  }
  try {
    const res = await pool.query(
      `UPDATE user_account SET status_id = 1 WHERE user_name = $1 AND status_id <> 1;`, [userName]);
    return { reset: (res.rowCount ?? 0) > 0, detail: `status_id reset for ${res.rowCount ?? 0} row(s)` };
  } catch (e) {
    return { reset: false, detail: `reset failed: ${e instanceof Error ? e.message : String(e)}` };
  }
}
