# VQ-007 — Operational Qualification (OQ) Protocol

| Field | Value |
|---|---|
| Document ID | VQ-007 |
| Title | Operational Qualification Protocol — OpenClinica CE |
| Version | 1.0 |
| Status | Approved for Execution |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval & Execution Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner (CDM) | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |
| **Executed by (tester)** | ________________ | ________________ | __________ |
| **Execution reviewed by (QA)** | ________________ | ________________ | __________ |

---

## 1. Purpose & Scope

To verify that OpenClinica CE, **as installed (VQ-006) and configured (VQ-004)**, performs its intended functions correctly, including the negative cases (things that must be *prevented*). Case selection and depth are driven by **VQ-005 (FMEA)**: High/Medium risks are scripted here; Low risks are not (justified in VQ-005 §3).

> **Regulatory reasoning — positive AND negative testing.** A control that *allows* the right thing is only half-proven; you must also show it *blocks* the wrong thing. "Data Entry cannot sign records" is as important as "Investigator can." Negative tests are where access-control and data-integrity systems actually earn trust, and where inspectors focus. Each case below states the URS + risk it covers so VQ-009 (RTM) closes the loop.

## 2. Test Environment & Data
- System per VQ-006 IQ (record IQ reference/version here at execution: __________).
- Test user accounts (one per role) created per CFG-010…014: `admin1`, `dm1`, `cra1`, `de1`, `inv1`.
- Test subjects for OQ: `S-901`, `S-902` (disposable; distinct from PQ subjects).

## 3. Execution Rules
- Record **Actual Result** against **Expected Result**; mark **Pass/Fail**; initial + date each case contemporaneously.
- **Evidence preference (FDA CSA):** pull evidence from the **system's own audit trail, database, and logs** wherever the test concerns a record or a control. Use screenshots only where no native digital record exists (e.g. a UI blocking message). The Playwright harness (STEP 3) automates §OQ-01…OQ-31 and exports structured JSON/JUnit evidence plus audit-trail extracts.
- Any Fail → **VQ-012 Deviation Log**; assess impact before proceeding.

---

## 4. Test Cases

### Group A — Authentication (URS-001..006 · R-01)

**OQ-01 — Valid login**
1. Navigate to login; enter valid `de1` credentials.
- **Expected:** Access granted; landing page for Data Entry role; login event recorded in audit/log with username + timestamp.
- **Evidence:** audit/log row. **Actual:** ____ **P/F:** ☐

**OQ-02 — Invalid password rejected**
1. Enter `de1` with wrong password.
- **Expected:** Access denied; generic error (no username/password enumeration); failed-attempt logged.
- **Evidence:** log row. **Actual:** ____ **P/F:** ☐

**OQ-03 — Password not shown / not stored in clear (URS-006)**
1. Observe entry field; inspect DB user table.
- **Expected:** Field masked; stored credential is a non-reversible hash (confirm algorithm — flag to VQ-010 if weak).
- **Evidence:** DB field value (redacted). **Actual:** ____ **P/F:** ☐

**OQ-04 — Password policy enforced (URS-003 · CFG-060-062)**
1. Attempt to set password `abc` (too short/simple).
- **Expected:** Rejected with policy message; compliant password accepted.
- **Evidence:** UI message. **Actual:** ____ **P/F:** ☐

**OQ-05 — Unique account attribution (URS-002)**
1. Confirm each test action is attributable to a single named user; no generic/shared login exists.
- **Expected:** No shared accounts; actions attributable.
- **Evidence:** user list + audit attribution. **Actual:** ____ **P/F:** ☐

### Group B — Role-Based Access Enforcement (URS-010..014 · R-02) — negative tests

**OQ-06 — Data Entry cannot access user admin (URS-012)**
1. As `de1`, attempt to reach user-creation/admin function.
- **Expected:** Function absent or access denied.
- **Evidence:** denial/absence. **Actual:** ____ **P/F:** ☐

**OQ-07 — Data Entry cannot sign records (URS-013)**
1. As `de1`, attempt to apply electronic sign-off.
- **Expected:** No sign capability for this role.
- **Evidence:** absence of control. **Actual:** ____ **P/F:** ☐

**OQ-08 — CRA/Monitor cannot enter/edit subject data (CFG-022)**
1. As `cra1`, attempt to edit a CRF field.
- **Expected:** Read/monitor only; edit blocked.
- **Evidence:** denial. **Actual:** ____ **P/F:** ☐

**OQ-09 — Investigator cannot administer users (SoD)**
1. As `inv1`, attempt user administration.
- **Expected:** Denied.
- **Evidence:** denial. **Actual:** ____ **P/F:** ☐

**OQ-10 — Positive authorisation: Data Manager can build/close queries & lock (CFG-025/027)**
1. As `dm1`, perform an authorised admin/query/lock action.
- **Expected:** Permitted per matrix.
- **Evidence:** action + audit row. **Actual:** ____ **P/F:** ☐

### Group C — Audit Trail Completeness (URS-030..033 · R-03/R-04)

**OQ-11 — Create action audited**
1. As `de1`, enter a new Vital Signs value; inspect audit trail.
- **Expected:** Audit row: action=create/insert, **new value**, **user=de1**, **timestamp**.
- **Evidence:** audit-trail extract. **Actual:** ____ **P/F:** ☐

**OQ-12 — Modify captures OLD and NEW value + REASON (URS-031)**
1. Edit the value from OQ-11; enter reason for change when prompted.
- **Expected:** Audit row shows **old value**, **new value**, **user**, **timestamp**, **reason for change** — all five present.
- **Evidence:** audit-trail extract (this is the single most important OQ evidence). **Actual:** ____ **P/F:** ☐

**OQ-13 — Reason-for-change enforced (CFG-071)**
1. Attempt to save a modification without entering a reason.
- **Expected:** Save blocked / reason required.
- **Evidence:** UI enforcement. **Actual:** ____ **P/F:** ☐

**OQ-14 — Delete/removal audited without obscuring prior data (URS-030)**
1. Remove/blank a value; inspect audit.
- **Expected:** Prior value still visible in audit history; deletion recorded with user/time.
- **Evidence:** audit extract. **Actual:** ____ **P/F:** ☐

**OQ-15 — Audit trail immutable (URS-032 · R-04)**
1. Attempt, as each role, to edit or delete an audit entry via the application.
2. Confirm at the database layer that modification is **enforced-rejected**: using a
   write-capable connection, attempt an `UPDATE` and a `DELETE` on an `audit_log_event`
   row and confirm the database **refuses both** (immutability trigger), rolling back.
- **Expected:** No application path to alter audit entries; direct UPDATE/DELETE rejected by the DB.
- **Evidence:** UI denial + DB rejection messages from the automated tamper attempt.
- **Note:** a "granted-privileges" check is *not* sufficient — the app role owns the tables and would retain rights regardless of REVOKE, so immutability is enforced by trigger and verified by attempting the write. **Actual:** ____ **P/F:** ☐

### Group D — Electronic Signature (URS-040..043 · R-05)

**OQ-16 — Investigator can sign; identity/time/meaning captured (URS-040)**
1. As `inv1`, sign a completed CRF/casebook.
- **Expected:** Signature records signer identity, date-time, and meaning ("approved — reviewed and correct").
- **Evidence:** signature record + audit row. **Actual:** ____ **P/F:** ☐

**OQ-17 — Re-authentication at signing (URS-042 · §11.200)**
1. During signing, confirm credential/re-auth is required (or controlled continuous session per config).
- **Expected:** Signing requires credential; cannot sign on someone else's open session without it.
- **Evidence:** re-auth prompt. **Actual:** ____ **P/F:** ☐

**OQ-18 — Signature bound to record; tamper invalidates (URS-041/043)**
1. Modify a signed record (via controlled unlock) and observe signature status.
- **Expected:** Change invalidates/flags the prior signature; signature cannot be transferred to another record.
- **Evidence:** status change + audit. **Actual:** ____ **P/F:** ☐

**OQ-19 — Signature manifestation legible in human-readable output (§11.50)**
1. Produce a record view/export including the signature block.
- **Expected:** Printed/exported name, date-time, meaning present.
- **Evidence:** export excerpt. **Actual:** ____ **P/F:** ☐

### Group E — Edit Checks (URS-021/022/023 · R-06)

**OQ-20 — Hard range check blocks out-of-range (CFG-050)**
1. Enter Systolic BP = 400.
- **Expected:** Save blocked; discrepancy raised.
- **Evidence:** discrepancy record + audit. **Actual:** ____ **P/F:** ☐

**OQ-21 — Required-field check (CFG-053)**
1. Leave a required field blank; save.
- **Expected:** Blocked.
- **Evidence:** UI message. **Actual:** ____ **P/F:** ☐

**OQ-22 — Soft logical check flags but allows with review (CFG-052)**
1. Enter Diastolic ≥ Systolic.
- **Expected:** Discrepancy flagged; save allowed pending review.
- **Evidence:** discrepancy record. **Actual:** ____ **P/F:** ☐

### Group F — Query / Discrepancy Workflow (URS-050..052 · R-07)

**OQ-23 — Raise and route a query**
1. As `dm1`, raise a query on a data point.
- **Expected:** Query created, state=Open, attributed + timestamped, visible to site.
- **Evidence:** query record. **Actual:** ____ **P/F:** ☐

**OQ-24 — Answer and close query; full exchange audited**
1. As `de1` answer; as `dm1` close.
- **Expected:** State transitions Open→Answered→Closed; full exchange retained in audit.
- **Evidence:** query history extract. **Actual:** ____ **P/F:** ☐

### Group G — Record Locking (URS-060/061 · R-08)

**OQ-25 — Lock prevents modification**
1. As `dm1`, lock a CRF; as `de1`, attempt to edit.
- **Expected:** Edit blocked while locked.
- **Evidence:** denial + status. **Actual:** ____ **P/F:** ☐

**OQ-26 — Controlled unlock is audited**
1. As authorised role, unlock; confirm audit entry for the unlock (user/time/reason).
- **Expected:** Unlock permitted only to authorised role and fully audited.
- **Evidence:** audit extract. **Actual:** ____ **P/F:** ☐

### Group H — Session & Account Security (URS-005/004 · R-09/R-10)

**OQ-27 — Session inactivity timeout (CFG-065)**
1. Log in; leave idle beyond 15 min (or configured value); attempt an action.
- **Expected:** Session invalidated; re-authentication required.
- **Evidence:** timeout behaviour + log. **Actual:** ____ **P/F:** ☐

**OQ-28 — Account lockout after N failures (CFG-063/064)**
1. Enter wrong password 5 times for `de1`.
- **Expected:** Account locked; further attempts refused; lockout logged; admin reset (or timed unlock) required.
- **Evidence:** log rows + locked state. **Actual:** ____ **P/F:** ☐

### Group I — Backup & Restore (URS-080/081 · R-11)

**OQ-29 — Backup produces a complete, restorable artefact**
1. Execute backup per SOP-002; record artefact + checksum.
- **Expected:** Backup completes; checksum recorded.
- **Evidence:** backup file + checksum. **Actual:** ____ **P/F:** ☐

**OQ-30 — Restore to known-good state (rehearsal)**
1. Restore backup to a clean instance; verify a known record + its audit trail are intact.
- **Expected:** Data and audit trail fully recovered; record counts reconcile.
- **Evidence:** pre/post reconciliation. **Actual:** ____ **P/F:** ☐

### Group J — Extract Integrity (URS-070/071 · R-12)

**OQ-31 — Export matches data of record**
1. Enter a known dataset; export (ODM/CSV); compare export to source values field-by-field.
- **Expected:** Export is complete and identical to source; no dropped/altered fields.
- **Evidence:** export file + reconciliation table. **Actual:** ____ **P/F:** ☐

---

## 5. Results Summary
| Group | Cases | Pass | Fail | Deviations (VQ-012 ref) |
|---|---|---|---|---|
| A Authentication | OQ-01..05 | | | |
| B RBAC | OQ-06..10 | | | |
| C Audit trail | OQ-11..15 | | | |
| D E-signature | OQ-16..19 | | | |
| E Edit checks | OQ-20..22 | | | |
| F Query workflow | OQ-23..24 | | | |
| G Record locking | OQ-25..26 | | | |
| H Session/account | OQ-27..28 | | | |
| I Backup/restore | OQ-29..30 | | | |
| J Extract | OQ-31 | | | |
| **Total** | **31 cases** | | | |

## 6. Acceptance
OQ passes when all cases Pass, or Fails are dispositioned in VQ-012 with QA-approved justification/CAPA and, where needed, re-test to Pass. Result feeds VQ-009 (RTM) and VQ-013 (Summary).
