# SOP-004 — Change Control

| Field | Value |
|---|---|
| Document ID | SOP-004 |
| Version | 1.0 |
| Effective Date | 2026-07-25 |
| Author | A. Hassan |
| System | OpenClinica CE — Study NWT-ORX201-201 |
| Review cycle | Annual |

### Approval
| Role | Name | Signature | Date |
|---|---|---|---|
| Author | A. Hassan | __________ | ______ |
| System Owner | __________ | __________ | ______ |
| QA | __________ | __________ | ______ |

---

## 1. Purpose
Ensure no change is made to the validated system without assessment, approval, testing, and documentation — preserving the validated state. Supports Part 11 §11.10(a)(k); Annex 11 §10.

> **Why this matters most for an EOL system.** Because OpenClinica CE runs a frozen, end-of-life stack (VQ-002 R-15), the deliberate strategy is *controlled stasis*: changes are rare and tightly governed. Change control is therefore the primary tool keeping this system trustworthy over time.

## 2. Scope
Any change to: application version, configuration baseline (VQ-004 CFG items), container images/digests, database, infrastructure, CRFs/edit-check rules, user-role definitions, or governing SOPs.

## 3. Responsibilities
- **Requestor:** raises change request with rationale.
- **System Owner:** assesses impact and validation effort.
- **QA:** approves change and required testing; approves closure.
- **IT/Admin:** implements after approval.

## 4. Procedure

### 4.1 Raise
Change Request records: description, reason, urgency (standard / emergency), components affected.

### 4.2 Impact & risk assessment
1. Identify affected **CFG items, URS requirements, and risks** (VQ-004/003/005).
2. Determine **regression test scope** — which OQ/PQ cases must be re-executed.
3. Assess GxP impact (patient safety / data integrity / product quality). High-impact changes require QA pre-approval before any implementation.

### 4.3 Approval
QA and System Owner approve the change **and** the test plan before implementation. Emergency changes may be implemented first under documented authorisation but require the same assessment and testing retrospectively without delay.

### 4.4 Implement & test
- Implement in a controlled manner; capture new image digests/config values.
- Execute the defined regression tests; capture evidence (prefer native digital records / Playwright harness).
- Update **VQ-004, VQ-009 (RTM), VQ-006 digests**, and affected documents.

### 4.5 Close
QA reviews evidence and closes the change. Update the version/change history. If the change materially alters scope, revalidation is scoped per risk and a summary addendum (VQ-013) is issued.

## 5. Change Log (maintained continuously)
| CR ID | Date | Description | Components | Regression tests | Approved by | Status |
|---|---|---|---|---|---|---|
| | | | | | | |

## 6. Records
Change requests, impact assessments, test evidence, approvals, updated documents.

## 7. References
Part 11 §11.10(a)(k); Annex 11 §10; VQ-003/004/005/006/009; SOP-003.
