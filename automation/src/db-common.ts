/**
 * Shared PostgreSQL connection parameters for the harness.
 *
 * HOST is pinned to IPv4 by default: Node 18+ resolves 'localhost' to IPv6 ::1 first, and
 * Postgres here binds IPv4, so a bare 'localhost' can yield a spurious ECONNREFUSED on ::1
 * before the IPv4 attempt (part of DEV-011). Using 127.0.0.1 explicitly avoids that.
 *
 * THE TWO POOLS ARE DELIBERATELY SEPARATE AND USE DIFFERENT CREDENTIALS — this separation
 * is itself part of the OQ-15 evidence and must be preserved:
 *   - audit-db.ts  -> PGUSER (oc_readonly, SELECT-only): extracts evidence; must never write.
 *   - admin-db.ts  -> PGADMIN_USER (openclinica, write-capable): runs fixtures and the OQ-15
 *     tamper attempt, so a rejected audit write proves an ENFORCED immutability trigger
 *     rather than a missing privilege. Do NOT consolidate these into one pool.
 */
import pg from 'pg';

const { Client } = pg;

/** IPv4-pinned host (coerces 'localhost' -> 127.0.0.1 to dodge the ::1-first pitfall). */
export function dbHost(): string {
  const h = process.env.PGHOST ?? '127.0.0.1';
  return h === 'localhost' ? '127.0.0.1' : h;
}
export function dbPort(): number { return Number(process.env.PGPORT ?? 5432); }
export function dbName(): string { return process.env.PGDATABASE ?? 'openclinica'; }
export function poolMax(): number { return Number(process.env.PG_POOL_MAX ?? 3); }

export interface DbCreds { user?: string; password?: string; }

/**
 * Fail-fast connectivity probe for one credential set. Connects, runs SELECT 1, closes.
 * Throws a descriptive error naming WHICH connection failed and WHAT it tried to reach,
 * so a broken environment halts the run loudly instead of surfacing as skipped tests.
 */
export async function pingConnection(label: string, creds: DbCreds): Promise<void> {
  const target = `${dbHost()}:${dbPort()}/${dbName()} as ${creds.user ?? '(default)'}`;
  const client = new Client({
    host: dbHost(),
    port: dbPort(),
    database: dbName(),
    user: creds.user,
    password: creds.password,
    connectionTimeoutMillis: 5_000,
  });
  try {
    await client.connect();
    await client.query('SELECT 1;');
  } catch (e) {
    const code = (e as { code?: string })?.code;
    throw new Error(
      `[DB globalSetup] ${label} connection FAILED -> tried ${target}` +
      `${code ? ` (${code})` : ''}: ${e instanceof Error ? e.message : String(e)}`,
    );
  } finally {
    await client.end().catch(() => { /* already closed / never connected */ });
  }
}
