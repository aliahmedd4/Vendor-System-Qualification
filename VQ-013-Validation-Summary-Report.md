# VQ-013 — Validation Summary Report

| Field | Value |
|---|---|
| Document ID | VQ-013 |
| Title | Validation Summary Report — OpenClinica CE for Study NWT-ORX201-201 |
| Version | 1.0 |
| Status | Draft — finalised & signed after IQ/OQ/PQ execution |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval (Release Authorisation)

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner (CDM) | ________________ | ________________ | __________ |
| Reviewer / IT & Security | ________________ | ________________ | __________ |
| **Approver / Quality Assurance (Release)** | ________________ | ________________ | __________ |

---

## 1. Purpose

To summarise the validation activities, results, deviations, and residual risks, and to make a **release decision** on whether OpenClinica CE is fit for its intended use in Study NWT-ORX201-201.

> **Regulatory reasoning.** The Summary Report is the mirror image of the Validation Plan: the plan promised what would be done and the acceptance criteria; the report demonstrates it was done and the criteria were met. QA's signature here is the **release authorisation** — the moment the system transitions to validated/production use. It must reconcile against VQ-001 §9 acceptance criteria explicitly; a summary that doesn't close the loop against its own plan is incomplete.

## 2. Scope Recap
Vendor qualification of self-hosted OpenClinica CE (GAMP 5 Category 4) as EDC for one Phase II study, covering authentication, RBAC, audit trail, e-signatures, edit checks, query workflow, record locking, session/account security, backup/restore, and extract integrity. Full scope per VQ-001.

## 3. Summary of Executed Activities *(completed at execution)*

| Deliverable | Ref | Status | Result |
|---|---|---|---|
| Validation Plan | VQ-001 | Approved | — |
| Supplier Assessment | VQ-002 | Complete | Medium–High supplier risk; limited vendor credit taken |
| URS | VQ-003 | Approved | 39 requirements |
| Configuration Specification | VQ-004 | Approved | All CFG items baselined |
| Risk Assessment (FMEA) | VQ-005 | Approved | 17 risks; High risks → scripted testing |
| IQ | VQ-006 | ☐ Executed | ___ / 20 steps Pass |
| OQ | VQ-007 | ☐ Executed | ___ / 31 cases Pass |
| PQ | VQ-008 | ☐ Executed | ___ / 14 steps + ALCOA+ Pass |
| RTM | VQ-009 | ☐ Complete | ___ / 39 requirements verified |
| Part 11 Gap | VQ-010 | Complete | 8 gaps, all dispositioned |
| Annex 11 | VQ-011 | Complete | Beyond-P11 items covered by SOPs |
| Deviation Log | VQ-012 | ☐ Closed | ___ deviations; ___ critical unresolved (target 0) |

## 4. Results Against Acceptance Criteria (VQ-001 §9)

| Acceptance criterion | Met? | Evidence |
|---|---|---|
| All IQ/OQ/PQ cases pass or dispositioned | ☐ | VQ-006/007/008 + VQ-012 |
| RTM shows every in-scope requirement traced to passed test | ☐ | VQ-009 |
| All critical/major risks have verified mitigations | ☐ | VQ-005 + OQ/PQ evidence |
| Every Part 11 / Annex 11 gap has a control or accepted residual risk | ☐ | VQ-010/011 |
| QA approves this report | ☐ | Signature block |

## 5. Deviations & Residual Risk *(completed at execution)*
- Total deviations: ___; corrected & retested: ___; controlled/accepted: ___.
- **Accepted residual risks (QA-signed):** (a) technology obsolescence of EOL stack — controlled by isolation + SOPs + migration contingency; (b) non-cryptographic signature binding — controlled by audit trail + locking; (c) no supplier agreement for free CE — mitigated by internal SOPs / Enterprise escalation path.
- **Open CAPAs at release:** ___ (e.g. formalise BCP — DEV-008). None may be a critical patient-safety/data-integrity item.

## 6. Statement of Validation & Release Decision

> *(Select and complete at execution.)*

☐ **RELEASED FOR USE.** Based on the executed IQ, OQ, and PQ, the documented traceability (VQ-009), the disposition of all deviations (VQ-012), and the compensating controls for all Part 11 / Annex 11 gaps (VQ-010/011), **OpenClinica Community Edition, as installed and configured, is fit for its intended use** as the EDC system for Study NWT-ORX201-201 and is released for use under the governing SOPs (SOP-001…005). Accepted residual risks are documented in §5 and signed by QA.

☐ **RELEASED WITH CONDITIONS** (list conditions/open CAPAs and due dates): __________________

☐ **NOT RELEASED** (reason): __________________

## 7. Validated-State Maintenance
Post-release, the validated state is maintained by: **SOP-004** (change control — no change to the baseline without impact assessment and re-test), **SOP-003** (periodic review incl. audit-trail review), **SOP-001** (access management), **SOP-002** (backup/restore), and **SOP-005** (incident management). Any change to the configuration baseline (VQ-004) or a version change triggers revalidation scoped by risk.

## 8. References
VQ-001 through VQ-012; SOP-001…005; 21 CFR Part 11; EU Annex 11; GAMP 5 (2nd ed.); FDA CSA guidance (2022).
