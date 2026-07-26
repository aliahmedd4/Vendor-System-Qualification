# SOP-003 — Periodic Review

| Field | Value |
|---|---|
| Document ID | SOP-003 |
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
Periodically confirm the system remains in a validated, compliant, and secure state. This is an **explicit EU Annex 11 §11 requirement with no direct Part 11 equivalent**, and includes the **audit-trail review** duty (Annex 11 §9).

## 2. Scope
Validated state, configuration baseline, access, audit trail, deviations/incidents, backups, and technology-currency risk of OpenClinica CE.

## 3. Frequency
**Annually**, and additionally after any major change or incident. Audit-trail review is performed at a defined **higher frequency (e.g. monthly)** for the active study.

## 4. Procedure — Review Checklist

| # | Review item | Evidence / Action |
|---|---|---|
| 1 | Configuration vs baseline (VQ-004) unchanged or changes were controlled | Compare live config to CFG baseline; confirm all changes have SOP-004 records |
| 2 | User access still appropriate | Cross-check active users vs staffing (SOP-001 §4.8); remove stale access |
| 3 | **Audit-trail review (Annex 11 §9)** | Sample GxP-relevant changes/deletions; confirm each has old/new/user/time/reason; investigate anomalies (e.g. off-hours edits, mass changes) |
| 4 | Deviations & incidents since last review | Confirm all closed or on track (VQ-012, SOP-005); look for recurring themes |
| 5 | Backups performed & restore tested | Confirm SOP-002 logs; annual restore rehearsal done |
| 6 | Security & **technology currency** | Re-assess EOL-stack risk (VQ-002 R-15); check for new CVEs; confirm isolation still in place; review migration/contingency status |
| 7 | Documentation current | VQ package & SOPs in date; training records current |
| 8 | Open CAPAs (e.g. BCP) | Status and due dates |

## 5. Output
A dated, signed **Periodic Review Report** stating whether the system remains validated/compliant, listing findings, actions, and any need for revalidation or change control. QA approves. Adverse findings feed SOP-004 (change) or SOP-005 (incident).

## 6. Records
Periodic review reports; audit-trail review records; action/CAPA tracker. Retained per policy.

## 7. References
Annex 11 §9, §11; VQ-002; VQ-004; SOP-001/002/004/005.
