/**
 * Playwright globalSetup — runs ONCE before any OQ test.
 *
 * It verifies BOTH database connections the harness depends on. If either fails, the whole
 * run aborts here with a message naming the failed connection and its target. This is
 * deliberate: in a validation package a DB-dependent test that is silently skipped for
 * connectivity is indistinguishable from an untested requirement, which is unacceptable
 * evidence. A connectivity problem must be a loud, immediate failure — not a skip.
 */
import 'dotenv/config';
import { pingConnection } from './src/db-common.js';

export default async function globalSetup(): Promise<void> {
  // Read-only evidence connection (oc_readonly) used by src/audit-db.ts.
  await pingConnection('read-only evidence (audit-db / oc_readonly)', {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  // Privileged fixture + OQ-15 tamper connection (openclinica) used by src/admin-db.ts.
  await pingConnection('privileged fixture (admin-db / openclinica)', {
    user: process.env.PGADMIN_USER ?? process.env.PGUSER,
    password: process.env.PGADMIN_PASSWORD ?? process.env.PGPASSWORD,
  });
}
