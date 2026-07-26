/**
 * Native audit-trail evidence extraction from OpenClinica's PostgreSQL database.
 *
 * WHY THIS FILE EXISTS (FDA Computer Software Assurance):
 * The strongest evidence that the audit trail is complete is the audit trail itself.
 * Rather than screenshotting a UI page, we query the system's own records and attach
 * the returned rows as evidence. These are native digital records - attributable,
 * time-stamped, and machine-verifiable - which is exactly what CSA encourages us to
 * prefer over documentation-heavy screenshotting.
 *
 * SCHEMA NOTE (verify at IQ-12): OpenClinica 3.x stores change history in
 * `audit_log_event`, which carries the five fields URS-031 requires:
 *   old_value, new_value, user_id (-> user_account.user_name), audit_date,
 *   reason_for_change.
 * Login attempts are recorded in `audit_user_login`. Column/table names MUST be
 * confirmed against the installed build during IQ; adjust the constants below if the
 * schema differs. Treat any mismatch as an IQ deviation (VQ-012), not a silent edit.
 */
import pg from 'pg';
import { dbHost, dbPort, dbName, poolMax } from './db-common.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

// READ-ONLY pool (oc_readonly): evidence extraction only. Never write-capable — kept
// separate from the privileged pool in admin-db.ts on purpose (see db-common.ts).
function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      host: dbHost(),          // IPv4-pinned (DEV-011)
      port: dbPort(),
      database: dbName(),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      max: poolMax(),
      idleTimeoutMillis: 5_000,
    });
  }
  return pool;
}

export async function closeDb(): Promise<void> {
  if (pool) { await pool.end(); pool = null; }
}

export interface AuditChangeRow {
  audit_id: number;
  audit_date: string;
  audit_table: string | null;
  entity_name: string | null;
  user_name: string | null;
  old_value: string | null;
  new_value: string | null;
  reason_for_change: string | null;
  event_type: string | null;
}

/**
 * Return the most recent change-audit rows, optionally filtered by the entity/field
 * name touched (e.g. a Vital Signs item). Used by OQ-11..OQ-14.
 */
export async function getRecentAuditChanges(limit = 20, entityLike?: string): Promise<AuditChangeRow[]> {
  const params: unknown[] = [];
  let where = '';
  if (entityLike) { params.push(`%${entityLike}%`); where = `WHERE ale.entity_name ILIKE $1`; }
  params.push(limit);

  const sql = `
    SELECT ale.audit_id,
           to_char(ale.audit_date, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS audit_date,
           ale.audit_table,
           ale.entity_name,
           ua.user_name,
           ale.old_value,
           ale.new_value,
           ale.reason_for_change,
           alet.name AS event_type
    FROM audit_log_event ale
    LEFT JOIN user_account ua           ON ua.user_id = ale.user_id
    LEFT JOIN audit_log_event_type alet ON alet.audit_log_event_type_id = ale.audit_log_event_type_id
    ${where}
    ORDER BY ale.audit_date DESC
    LIMIT $${params.length};`;

  const res = await getPool().query(sql, params);
  return res.rows as AuditChangeRow[];
}

/**
 * Assert an audit row exists for a change from oldValue -> newValue by a given user,
 * WITH a non-empty reason_for_change. Returns the matching row or null.
 * This is the concrete OQ-12 acceptance check (all five URS-031 fields present).
 */
export async function findChangeWithReason(opts: {
  userName: string; oldValue: string; newValue: string;
}): Promise<AuditChangeRow | null> {
  const sql = `
    SELECT ale.audit_id,
           to_char(ale.audit_date, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS audit_date,
           ale.audit_table, ale.entity_name, ua.user_name,
           ale.old_value, ale.new_value, ale.reason_for_change, alet.name AS event_type
    FROM audit_log_event ale
    LEFT JOIN user_account ua           ON ua.user_id = ale.user_id
    LEFT JOIN audit_log_event_type alet ON alet.audit_log_event_type_id = ale.audit_log_event_type_id
    WHERE ua.user_name = $1
      AND ale.old_value = $2
      AND ale.new_value = $3
      AND ale.reason_for_change IS NOT NULL
      AND length(trim(ale.reason_for_change)) > 0
    ORDER BY ale.audit_date DESC
    LIMIT 1;`;
  const res = await getPool().query(sql, [opts.userName, opts.oldValue, opts.newValue]);
  return (res.rows[0] as AuditChangeRow) ?? null;
}

export interface LoginAuditRow {
  user_name: string;
  login_status_code: number | null;   // OpenClinica 3.13 column (integer status code)
  login_date: string;
}

/** Recent login attempts (OQ-01/OQ-02/OQ-28 evidence). Column names verified against the
 *  live audit_user_login schema (DEV-012): the status column is `login_status_code`. */
export async function getRecentLogins(userName: string, limit = 10): Promise<LoginAuditRow[]> {
  const sql = `
    SELECT user_name,
           login_status_code,
           to_char(login_attempt_date AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS login_date
    FROM audit_user_login
    WHERE user_name = $1
    ORDER BY login_attempt_date DESC
    LIMIT $2;`;
  const res = await getPool().query(sql, [userName, limit]);
  return res.rows as LoginAuditRow[];
}

/**
 * OQ-15 / R-04 is proven FUNCTIONALLY (attempt an UPDATE/DELETE and expect the DB to
 * reject it) in `admin-db.ts`, NOT by inspecting granted privileges here.
 *
 * Why not a privilege query: (a) this read-only session cannot see grants made to the
 * application role, so a privilege query would return an empty set and any
 * "does not contain UPDATE" assertion would pass vacuously; and (b) if the app role
 * OWNS the audit tables it retains UPDATE/DELETE regardless of any REVOKE, so a granted-
 * privilege check would not reflect whether tampering is actually blocked. The only
 * trustworthy test is to try to tamper and confirm the database refuses.
 */
