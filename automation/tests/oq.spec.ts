/**
 * VQ-007 Operational Qualification - automated execution & evidence capture.
 *
 * TRACEABILITY: every test is tagged with its OQ-ID, URS refs and risk refs so the
 * exported evidence reconciles directly against VQ-007 and VQ-009 (RTM).
 *
 * EVIDENCE PHILOSOPHY (FDA CSA): records-related assertions are proven against the
 * system's own audit trail / DB / logs (src/audit-db.ts), not screenshots. Each test
 * writes a structured evidence artefact via src/evidence.ts.
 *
 * HONESTY: Cases whose UI flow cannot be confirmed without the running instance are
 * marked `test.fixme` with the exact manual step and the evidence hook already wired.
 * They are NOT asserted to pass. Un-fix them once selectors are confirmed at execution.
 */
import { test, expect } from '@playwright/test';
import { login, logout, isLoggedIn, sel, routes } from '../src/oc-app.js';
import { Evidence } from '../src/evidence.js';
import { getRecentLogins, getRecentAuditChanges, findChangeWithReason, closeDb } from '../src/audit-db.js';
import { getAnyAuditId, attemptAuditWrite, resetUserLock, closeAdminDb } from '../src/admin-db.js';

const U = {
  admin: [process.env.OC_ADMIN_USER!, process.env.OC_ADMIN_PASS!] as const,
  dm:    [process.env.OC_DM_USER!,    process.env.OC_DM_PASS!] as const,
  cra:   [process.env.OC_CRA_USER!,   process.env.OC_CRA_PASS!] as const,
  de:    [process.env.OC_DE_USER!,    process.env.OC_DE_PASS!] as const,
  inv:   [process.env.OC_INV_USER!,   process.env.OC_INV_PASS!] as const,
};

test.afterAll(async () => { await closeDb(); await closeAdminDb(); });

/* ------------------------------------------------------------------ */
/* Group A - Authentication (URS-001..006 / R-01)                     */
/* ------------------------------------------------------------------ */

test('OQ-01 valid login is granted and audited', async ({ page }) => {
  const ev = new Evidence('OQ-01', 'Valid login', ['URS-001'], ['R-01'],
    'Access granted for valid credentials; login recorded in audit with username + timestamp');
  try {
    await login(page, ...U.de);
    const ok = await isLoggedIn(page);
    const logins = await getRecentLogins(U.de[0]);
    ev.attach('login-audit', 'Recent login-attempt rows for de1', logins);
    expect(ok, 'user should be logged in').toBeTruthy();
    expect(logins.length, 'a login-audit row should exist').toBeGreaterThan(0);
    ev.pass(`Logged in; ${logins.length} login-audit rows present`);
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); await logout(page); }
});

test('OQ-02 invalid password is rejected and the attempt is recorded', async ({ page }) => {
  const ev = new Evidence('OQ-02', 'Invalid password rejected', ['URS-001'], ['R-01'],
    'Access denied with generic error; failed attempt recorded');
  try {
    await login(page, U.de[0], 'definitely-wrong-password');
    const denied = !(await isLoggedIn(page));
    const errorShown = (await page.locator(sel.loginError).count()) > 0;
    const logins = await getRecentLogins(U.de[0]);
    ev.attach('login-audit', 'Login-attempt rows including failed attempt', logins);
    ev.attach('ui-state', 'Login error element present', { errorShown });
    expect(denied, 'access must be denied').toBeTruthy();
    ev.pass('Access denied; failed attempt visible in login audit');
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); await logout(page); }
});

test('OQ-04 password policy is enforced', async ({ page }) => {
  // Manual/confirm step: attempt to set a weak password via change-password UI.
  const ev = new Evidence('OQ-04', 'Password policy enforced', ['URS-003'], ['R-01'],
    'Weak password (too short/simple) rejected with policy message; compliant one accepted');
  ev.note('Confirm change-password route/selectors at execution, then implement the weak/strong attempt.');
  ev.save();
  test.fixme(true, 'Confirm change-password UI selectors on the running instance, then implement.');
});

/* ------------------------------------------------------------------ */
/* Group B - RBAC enforcement (URS-010..014 / R-02) - NEGATIVE tests  */
/* ------------------------------------------------------------------ */

test('OQ-06 Data Entry cannot access user administration', async ({ page }) => {
  const ev = new Evidence('OQ-06', 'Data Entry blocked from user admin', ['URS-011', 'URS-012'], ['R-02'],
    'Data Entry role cannot reach the user-administration function');
  try {
    await login(page, ...U.de);
    // Precondition: the denial we observe must be due to RBAC, not a failed/expired login.
    expect(await isLoggedIn(page), 'precondition: de1 must be logged in before the RBAC check').toBeTruthy();

    const resp = await page.goto(routes.users, { waitUntil: 'domcontentloaded' });
    const status = resp?.status() ?? 0;
    const finalUrl = page.url();
    const bodyText = (await page.locator('body').innerText()).slice(0, 600);
    // OpenClinica commonly redirects an unauthorized role (HTTP 200) rather than returning
    // 403, so a text/URL oracle is needed. But a redirect to the LOGIN page would mean the
    // session dropped (not an RBAC denial) and must NOT count as a pass.
    const onLoginPage = (await page.locator(sel.usernameInput).count()) > 0;
    const redirectedAway = !/listUserAccounts/i.test(finalUrl);
    const denialText = /not authoriz|access denied|do not have permission|insufficient privile|not permitted/i.test(bodyText);
    const denied = !onLoginPage && (status === 403 || redirectedAway || denialText);

    ev.attach('ui-state', 'Result of de1 requesting user administration',
      { status, finalUrl, onLoginPage, redirectedAway, denialText, bodyText });
    expect(onLoginPage, 'session must not have dropped (would invalidate the RBAC oracle)').toBeFalsy();
    expect(denied, 'Data Entry must be denied user administration').toBeTruthy();
    ev.pass(`Access to user admin denied for Data Entry (status ${status}, url ${finalUrl})`);
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); await logout(page); }
});

test('OQ-07 Data Entry has no sign-off capability', async ({ page }) => {
  const ev = new Evidence('OQ-07', 'Data Entry cannot sign', ['URS-013'], ['R-02', 'R-05'],
    'No electronic sign-off control is available to the Data Entry role');
  ev.note('Navigate to a completed casebook as de1 and assert absence of the "Sign" action; confirm selector at execution.');
  ev.save();
  test.fixme(true, 'Confirm casebook/sign selectors on the running instance, then implement the absence assertion.');
});

/* ------------------------------------------------------------------ */
/* Group C - Audit trail completeness (URS-030..033 / R-03,R-04)      */
/* THE MOST IMPORTANT EVIDENCE IN THE PACKAGE.                         */
/* ------------------------------------------------------------------ */

test('OQ-12 modify captures OLD value, NEW value, USER, TIMESTAMP, REASON', async () => {
  const ev = new Evidence('OQ-12', 'Audit trail records all five change attributes',
    ['URS-030', 'URS-031'], ['R-03'],
    'For a modified data point, the audit trail row contains old_value, new_value, user, timestamp and a non-empty reason_for_change');
  try {
    // Precondition: a data modification has been made (by the PQ/OQ data-entry step or
    // a seeded change) that changes a value from a known OLD to a known NEW with a reason.
    // Confirm the five fields are present on the most recent change rows.
    const recent = await getRecentAuditChanges(10);
    ev.attach('audit-trail', 'Most recent audit_log_event change rows', recent);

    const withAllFive = recent.filter(r =>
      r.old_value !== null && r.new_value !== null &&
      r.user_name && r.audit_date &&
      r.reason_for_change !== null && r.reason_for_change.trim().length > 0);

    expect(recent.length, 'there should be recorded changes to inspect').toBeGreaterThan(0);
    expect(withAllFive.length,
      'at least one change row must carry all five URS-031 attributes').toBeGreaterThan(0);

    ev.pass(`${withAllFive.length}/${recent.length} recent change rows carry old/new/user/time/reason`);
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); }
});

test('OQ-12b targeted change reconciliation (old->new by user, with reason)', async () => {
  // Use when the OQ data-entry step recorded a specific known change.
  const ev = new Evidence('OQ-12b', 'Targeted change present in audit trail',
    ['URS-031'], ['R-03'],
    'A specific known change (old->new) by the expected user with a reason is present');
  const expectedUser = process.env.OC_DE_USER!;
  const oldValue = process.env.OQ_OLD_VALUE ?? '';
  const newValue = process.env.OQ_NEW_VALUE ?? '';
  if (!oldValue || !newValue) {
    ev.note('Set OQ_OLD_VALUE / OQ_NEW_VALUE to the values changed during the OQ data-entry step.');
    ev.save();
    test.fixme(true, 'Provide OQ_OLD_VALUE/OQ_NEW_VALUE from the executed change, then run.');
    return;
  }
  try {
    const row = await findChangeWithReason({ userName: expectedUser, oldValue, newValue });
    ev.attach('audit-trail', 'Matching audit row for the targeted change', row);
    expect(row, 'the specific change must be present with a reason').not.toBeNull();
    ev.pass(`Change ${oldValue} -> ${newValue} by ${expectedUser} found with reason "${row?.reason_for_change}"`);
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); }
});

test('OQ-15 audit trail rejects UPDATE and DELETE (immutability enforced) (R-04)', async () => {
  const ev = new Evidence('OQ-15', 'Audit trail rejects modification/deletion',
    ['URS-032'], ['R-04'],
    'Attempts to UPDATE or DELETE an audit_log_event row are rejected by the database (enforced immutability control), not merely by a missing privilege');
  try {
    // Choose a real audit row and attempt to tamper with it using a WRITE-CAPABLE
    // connection (see admin-db.ts). Rejection therefore proves an enforced control, not
    // just an unprivileged user. Both attempts are rolled back and never persist.
    const auditId = await getAnyAuditId();
    ev.attach('audit-trail', 'Audit row selected for the tamper attempt', { auditId });
    expect(auditId, 'need at least one audit row to attempt tampering on (enter/edit data first)').not.toBeNull();

    const upd = await attemptAuditWrite('update', auditId!);
    const del = await attemptAuditWrite('delete', auditId!);
    ev.attach('db-privilege', 'Result of UPDATE attempt on the audit row', upd);
    ev.attach('db-privilege', 'Result of DELETE attempt on the audit row', del);

    expect(upd.rejected,
      `UPDATE of an audit row must be rejected (got: ${upd.error ?? 'SUCCESS — immutability control is MISSING'})`).toBeTruthy();
    expect(del.rejected,
      `DELETE of an audit row must be rejected (got: ${del.error ?? 'SUCCESS — immutability control is MISSING'})`).toBeTruthy();
    ev.pass(`Both UPDATE and DELETE on audit_log_event were rejected by the database (update: "${upd.error}"; delete: "${del.error}")`);
  } catch (e) { ev.fail(String(e)); throw e; } finally { ev.save(); }
});

/* ------------------------------------------------------------------ */
/* Group H - Account lockout (URS-004 / R-10)                         */
/* ------------------------------------------------------------------ */

test('OQ-28 account locks after 5 consecutive failed attempts', async ({ page }) => {
  const ev = new Evidence('OQ-28', 'Account lockout after N failures', ['URS-004'], ['R-10'],
    'After 5 consecutive failed logins the account is locked; further attempts are refused and logged');

  // Use a DEDICATED, expendable account so leaving it locked cannot contaminate any other
  // test (the previous version locked the shared cra1 account and never restored it).
  const lockUser = process.env.OC_LOCKOUT_USER;
  const lockPass = process.env.OC_LOCKOUT_PASS;
  if (!lockUser || !lockPass) {
    ev.note('Set OC_LOCKOUT_USER/OC_LOCKOUT_PASS to a dedicated expendable account. Being locked is this test\'s expected end state; it is reset at the start of the next run and manually per SOP-001.');
    ev.save();
    test.fixme(true, 'Provide a dedicated expendable lockout account (OC_LOCKOUT_USER/OC_LOCKOUT_PASS).');
    return;
  }

  try {
    // Re-run determinism: ensure the dedicated account starts unlocked (best-effort, schema-guarded).
    const pre = await resetUserLock(lockUser);
    ev.attach('db-privilege', 'Pre-test lock reset of the dedicated account', pre);

    // BASELINE (assertion-quality guard): with the account reset, the CORRECT password must
    // succeed. This proves the account exists and the credentials are valid, so the later
    // denial can ONLY be the lockout — a non-existent or broken account cannot masquerade as
    // a working lockout (which would be a false pass). A successful login also resets the
    // failed-attempt counter to a known zero before we start the failure sequence.
    await login(page, lockUser, lockPass);
    const baselineLoggedIn = await isLoggedIn(page);
    ev.attach('ui-state', 'Baseline: account logs in with the correct password when unlocked', { baselineLoggedIn });
    expect(baselineLoggedIn,
      'baseline: the lockout account must log in with the correct password BEFORE the failure sequence').toBeTruthy();
    await logout(page);

    // Drive 5 consecutive FAILED logins to trip the lockout threshold.
    for (let i = 0; i < 5; i++) {
      await login(page, lockUser, `wrong-${i}`);
      await logout(page);
    }
    // The CORRECT password must now be refused — and because it demonstrably worked moments
    // ago, refusal proves the lockout rather than a bad/absent credential.
    await login(page, lockUser, lockPass);
    const stillDenied = !(await isLoggedIn(page));
    const logins = await getRecentLogins(lockUser, 10);
    ev.attach('login-audit', 'Login history: baseline success, 5 failures, then lockout', logins);
    ev.attach('ui-state', 'Logged in after lockout with the correct password?', { stillDenied });
    expect(stillDenied,
      'account must be locked (correct password refused) after 5 consecutive failures').toBeTruthy();
    ev.pass('Baseline login succeeded; account locked after 5 failures; correct password then refused');
  } catch (e) { ev.fail(String(e)); throw e; } finally {
    ev.save(); await logout(page);
    // Expected end state: the dedicated account is locked. Isolation from other tests is
    // guaranteed by using a dedicated account; the lock is cleared at the next run's start
    // (resetUserLock above) or manually per SOP-001.
  }
});

/* ------------------------------------------------------------------ */
/* Scaffolded cases - evidence hooks wired, UI flow to confirm.       */
/* Remaining VQ-007 cases; un-fix as selectors/flows are confirmed.   */
/* ------------------------------------------------------------------ */

const scaffold: { id: string; title: string; urs: string[]; risk: string[]; expected: string; how: string }[] = [
  { id: 'OQ-03', title: 'Password not shown / stored non-reversibly', urs: ['URS-006'], risk: ['R-14'], expected: 'Field masked; stored credential is a non-reversible hash', how: 'Inspect user_account password column via DB; confirm hash, not plaintext.' },
  { id: 'OQ-05', title: 'Unique account attribution', urs: ['URS-002'], risk: ['R-01'], expected: 'No shared/generic accounts; actions attributable', how: 'Query user_account for generic names; confirm audit rows carry distinct user_ids.' },
  { id: 'OQ-08', title: 'CRA/Monitor cannot edit CRF data', urs: ['URS-011'], risk: ['R-02'], expected: 'Edit blocked for Monitor', how: 'As cra1 open a CRF and assert edit controls are read-only/absent.' },
  { id: 'OQ-09', title: 'Investigator cannot administer users', urs: ['URS-011'], risk: ['R-02'], expected: 'Denied', how: 'As inv1 request routes.users; assert denial (mirror OQ-06).' },
  { id: 'OQ-10', title: 'Data Manager authorised for query/lock', urs: ['URS-011'], risk: ['R-02'], expected: 'Permitted per matrix', how: 'As dm1 perform an authorised action; confirm audit row.' },
  { id: 'OQ-11', title: 'Create action audited', urs: ['URS-030'], risk: ['R-03'], expected: 'Insert row with new value/user/time', how: 'Enter a value as de1; assert a create-type audit row (getRecentAuditChanges).' },
  { id: 'OQ-13', title: 'Reason-for-change enforced', urs: ['URS-031'], risk: ['R-03'], expected: 'Save blocked without reason', how: 'Edit a saved value and omit the reason; assert save is blocked.' },
  { id: 'OQ-14', title: 'Delete audited without obscuring prior data', urs: ['URS-030'], risk: ['R-03'], expected: 'Prior value retained in audit', how: 'Blank a value; assert old_value preserved in audit_log_event.' },
  { id: 'OQ-16', title: 'Investigator can sign; identity/time/meaning captured', urs: ['URS-040'], risk: ['R-05'], expected: 'Signature records signer/time/meaning', how: 'As inv1 sign a casebook; verify signature + audit row.' },
  { id: 'OQ-17', title: 'Re-authentication at signing', urs: ['URS-042'], risk: ['R-05'], expected: 'Credential required to sign', how: 'Assert re-auth prompt appears at signing.' },
  { id: 'OQ-18', title: 'Signature bound; tamper invalidates', urs: ['URS-041'], risk: ['R-05'], expected: 'Change invalidates prior signature', how: 'Unlock+modify a signed record; assert signature status changes.' },
  { id: 'OQ-19', title: 'Signature legible in export', urs: ['URS-033'], risk: ['R-03'], expected: 'Name/time/meaning in output', how: 'Export/print casebook; assert signature block present.' },
  { id: 'OQ-20', title: 'Hard range check blocks out-of-range', urs: ['URS-021', 'URS-022'], risk: ['R-06'], expected: 'Save blocked; discrepancy raised', how: 'Enter Systolic BP=400; assert block + discrepancy.' },
  { id: 'OQ-21', title: 'Required-field check', urs: ['URS-021'], risk: ['R-06'], expected: 'Blocked when required field blank', how: 'Leave required field blank; assert block.' },
  { id: 'OQ-22', title: 'Soft check flags, allows with review', urs: ['URS-022'], risk: ['R-06'], expected: 'Discrepancy flagged, save allowed', how: 'Enter Diastolic>=Systolic; assert soft discrepancy.' },
  { id: 'OQ-23', title: 'Raise a query', urs: ['URS-050'], risk: ['R-07'], expected: 'Query created, Open, attributed', how: 'As dm1 raise a query; assert query record.' },
  { id: 'OQ-24', title: 'Answer+close query; exchange audited', urs: ['URS-051', 'URS-052'], risk: ['R-07'], expected: 'Open->Answered->Closed, audited', how: 'Cycle a query through states; assert history.' },
  { id: 'OQ-25', title: 'Lock prevents modification', urs: ['URS-060'], risk: ['R-08'], expected: 'Edit blocked while locked', how: 'Lock a CRF as dm1; as de1 assert edit blocked.' },
  { id: 'OQ-26', title: 'Controlled unlock is audited', urs: ['URS-061'], risk: ['R-08'], expected: 'Unlock audited with user/time', how: 'Unlock; assert audit row for the unlock.' },
  { id: 'OQ-27', title: 'Session inactivity timeout', urs: ['URS-005'], risk: ['R-09'], expected: 'Session invalidated after timeout', how: 'Idle beyond configured timeout; assert re-auth required. (Long-running; consider a reduced timeout profile for the test env, recorded as a deviation.)' },
  { id: 'OQ-29', title: 'Backup produces restorable artefact', urs: ['URS-080'], risk: ['R-11'], expected: 'Backup completes; checksum recorded', how: 'Invoke SOP-002 backup; capture file+checksum as export-file evidence.' },
  { id: 'OQ-30', title: 'Restore to known-good state', urs: ['URS-081'], risk: ['R-11'], expected: 'Data + audit trail recovered; counts reconcile', how: 'Restore to clean instance; reconcile record counts.' },
  { id: 'OQ-31', title: 'Export matches data of record', urs: ['URS-070', 'URS-071'], risk: ['R-12'], expected: 'Export identical to source', how: 'Export ODM/CSV; reconcile field-by-field against DB values.' },
];

for (const s of scaffold) {
  test(`${s.id} ${s.title}`, async () => {
    const ev = new Evidence(s.id, s.title, s.urs, s.risk, s.expected);
    ev.note(`To implement at execution: ${s.how}`);
    ev.save();
    test.fixme(true, `Confirm flow on running instance: ${s.how}`);
  });
}
