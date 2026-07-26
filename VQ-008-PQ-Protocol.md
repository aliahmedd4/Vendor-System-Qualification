# VQ-008 — Performance Qualification (PQ) Protocol

| Field | Value |
|---|---|
| Document ID | VQ-008 |
| Title | Performance Qualification Protocol — Mock Study NWT-ORX201-201 |
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

## 1. Purpose

To demonstrate that the qualified system supports the **end-to-end clinical business process** under realistic conditions, using a mock study. Where OQ proves functions work in isolation, PQ proves the *workflow* works as clinical staff would actually use it.

> **Regulatory reasoning.** PQ is the "intended use" proof. IQ/OQ can both pass while the system is still unusable for the real process (e.g. roles collide, the visit schedule doesn't match the protocol, the extract can't be reconciled). PQ runs the process a data manager and investigator would run, with real handoffs between roles, and reconciles the final extract against what was entered — the ultimate data-integrity check (ALCOA+). Using **fabricated** subjects (no real patient data) is deliberate and required for a non-production qualification.

## 2. Mock Study Design
- **Protocol:** NWT-ORX201-201 (Phase II, psoriasis). **Site:** SITE-01.
- **Subjects:** S-001 … S-010 (10 fabricated subjects).
- **Visits used:** Screening, Baseline, Week 4, Week 8, Week 12.
- **CRFs:** Demographics, Vital Signs, PASI Score, Adverse Events, Con Meds, Study Drug Admin.
- **Roles exercised:** `de1` (Data Entry), `dm1` (Data Manager), `cra1` (Monitor), `inv1` (Investigator).

## 3. PQ Scenario Steps

| Step | Role | Action | Expected | Evidence | P/F |
|---|---|---|---|---|---|
| PQ-01 | de1 | Enrol 10 subjects (S-001…S-010) at Screening | 10 subjects created; IDs unique; enrolment audited | subject list + audit | ☐ |
| PQ-02 | de1 | Enter Demographics + Vital Signs at Baseline for all 10 | Data saved; edit checks pass for valid data | CRF status report | ☐ |
| PQ-03 | de1 | Deliberately enter 1 out-of-range Vital Sign (S-003) | Hard check blocks / raises discrepancy | discrepancy record | ☐ |
| PQ-04 | de1 | Enter Week 4 & Week 8 visit data for all subjects | Longitudinal data captured against correct events | event/CRF matrix | ☐ |
| PQ-05 | dm1 | Review data; raise ≥3 queries (incl. the S-003 discrepancy) | Queries created, attributed, Open | query list | ☐ |
| PQ-06 | de1 | Respond to queries; correct S-003 value (reason for change captured) | Responses recorded; correction audited with old/new/reason | audit extract | ☐ |
| PQ-07 | dm1 | Verify corrections; close all queries | All queries Closed; exchange retained | query history | ☐ |
| PQ-08 | de1 | Enter Week 12 (EoT) data; complete casebooks | Casebooks complete for all 10 | completeness report | ☐ |
| PQ-09 | inv1 | Electronically sign off all 10 subject casebooks | Signatures applied w/ identity, time, meaning; re-auth enforced | signature records | ☐ |
| PQ-10 | dm1 | Lock signed casebooks | Records locked; further edits blocked | lock status | ☐ |
| PQ-11 | de1 | Attempt to edit a locked/signed record | Blocked | denial evidence | ☐ |
| PQ-12 | dm1 | Extract full study dataset (ODM/XML + CSV) | Export produced for all 10 subjects/all visits | export files | ☐ |
| PQ-13 | Tester | **Reconcile extract vs source**: pick 10% of fields (or all key fields) and compare export to entered/audited values | 100% match; no dropped/altered data | reconciliation table | ☐ |
| PQ-14 | Tester | Produce human-readable subject casebook + audit trail for S-001 | Complete, legible record incl. changes and signature | PDF/print evidence | ☐ |

## 4. Data-Integrity (ALCOA+) Reconciliation

For the extract in PQ-12/13, confirm each attribute:

| ALCOA+ attribute | Check | Result |
|---|---|---|
| Attributable | Every entry/change traces to a named user | ☐ |
| Legible | Export and casebook human-readable | ☐ |
| Contemporaneous | Timestamps reflect actual entry time | ☐ |
| Original | Source data of record preserved; audit shows originals | ☐ |
| Accurate | Extract == source (PQ-13 reconciliation 100%) | ☐ |
| Complete | All 10 subjects, all visits present | ☐ |
| Consistent | Sequence of events logical in audit trail | ☐ |
| Enduring | Data persists (survives restart; backup exists) | ☐ |
| Available | Data retrievable/exportable on demand | ☐ |

## 5. Acceptance
PQ passes when PQ-01…PQ-14 pass and the ALCOA+ reconciliation is fully satisfied, or exceptions are dispositioned in VQ-012 with QA approval. The reconciled extract and signed casebooks are retained as PQ evidence and referenced in VQ-013.
