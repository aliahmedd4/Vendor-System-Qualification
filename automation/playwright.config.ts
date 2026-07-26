import { defineConfig } from '@playwright/test';
import 'dotenv/config';

/**
 * Playwright configuration for the OpenClinica CE OQ evidence harness (VQ-007).
 *
 * Reporting strategy (FDA Computer Software Assurance):
 *  - JUnit XML  -> machine-readable pass/fail record for the validation file
 *  - JSON       -> full structured result, linked to native audit-trail evidence
 *  - HTML       -> human-readable review copy
 *
 * We deliberately DO NOT rely on screenshots as primary evidence. Screenshots are
 * captured only on failure as a debugging aid. Primary evidence for records-related
 * cases is the OpenClinica audit trail / DB and application logs (see src/audit-db.ts).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,        // qualification runs are sequential + deterministic
  retries: 0,                  // a re-run must be a deliberate, logged re-execution
  workers: 1,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'evidence/junit/oq-results.xml' }],
    ['json', { outputFile: 'evidence/json/oq-results.json' }],
    ['html', { outputFolder: 'evidence/html-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.OC_BASE_URL ?? 'https://localhost',
    ignoreHTTPSErrors: true,   // self-signed cert in the qualification env (see IQ-14)
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
});
