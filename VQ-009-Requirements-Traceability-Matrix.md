# VQ-009 — Requirements Traceability Matrix (RTM)

| Field | Value |
|---|---|
| Document ID | VQ-009 |
| Title | Requirements Traceability Matrix |
| Version | 1.0 |
| Status | Approved (result column completed at execution) |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Purpose

To provide bidirectional traceability from **URS → Configuration → Test Case → Result**, proving no requirement is unverified and no test is orphaned.

> **Regulatory reasoning.** The RTM is the auditor's map and the sponsor's completeness proof. Read left-to-right it answers "is every requirement tested?"; read right-to-left it answers "why does this test exist?". A requirement with no test is an **coverage gap**; a test with no requirement is **scope creep** (or a missing requirement). At execution, the Result column is populated from OQ/PQ outcomes and any deviation reference — that is what turns this from a plan into evidence.

## 2. Traceability Matrix

| URS ID | Requirement (short) | Priority | Config item (VQ-004) | Risk (VQ-005) | Test case(s) | Result | Deviation ref |
|---|---|:--:|---|---|---|---|---|
| URS-001 | Unique-user authentication | C | CFG-010..014 | R-01 | OQ-01, OQ-05 | ☐ | |
| URS-002 | No shared accounts | C | CFG-010..014 | R-01 | OQ-05 | ☐ | |
| URS-003 | Password policy | H | CFG-060-062 | R-01 | OQ-04, IQ-17 | ☐ | |
| URS-004 | Account lockout | H | CFG-063-064 | R-10 | OQ-28 | ☐ | |
| URS-005 | Session timeout | H | CFG-065 | R-09 | OQ-27, IQ-16 | ☐ | |
| URS-006 | Password not clear-text | C | CFG-066 | R-14 | OQ-03, IQ-11 | ☐ | |
| URS-010 | Role model | C | CFG-010-014 | R-02 | OQ-06..10 | ☐ | |
| URS-011 | Function-to-role restriction | C | CFG-020-030 | R-02 | OQ-06..10 | ☐ | |
| URS-012 | Data Entry ≠ admin | C | CFG-020 | R-02 | OQ-06 | ☐ | |
| URS-013 | Only Investigator signs | C | CFG-026 | R-02/R-05 | OQ-07, OQ-16 | ☐ | |
| URS-014 | Study/site scoping | H | CFG-041 | R-02 | OQ-08 | ☐ | |
| URS-020 | Study CRFs presented | H | CFG-044 | R-06 | PQ-02 | ☐ | |
| URS-021 | Field data-type/range | C | CFG-046-049,053 | R-06 | OQ-20, OQ-21 | ☐ | |
| URS-022 | Edit checks fire | C | CFG-050-055 | R-06 | OQ-20, OQ-22, PQ-03 | ☐ | |
| URS-023 | Hard/soft check behaviour | H | CFG-050,052 | R-06 | OQ-20, OQ-22 | ☐ | |
| URS-024 | Scheduled visits | M | CFG-042 | R-06 | PQ-04 | ☐ | |
| URS-030 | Audit trail of CRUD | C | CFG-070 | R-03 | OQ-11, OQ-14 | ☐ | |
| URS-031 | Old/new/user/time/reason | C | CFG-070-071 | R-03 | OQ-12, OQ-13 | ☐ | |
| URS-032 | Audit trail immutable | C | CFG-072 | R-04 | OQ-15, IQ-13 | ☐ | |
| URS-033 | Audit retained/exportable | H | CFG-070 | R-03 | PQ-14, OQ-19 | ☐ | |
| URS-040 | E-signature identity/time/meaning | C | CFG-073 | R-05 | OQ-16, PQ-09 | ☐ | |
| URS-041 | Signature bound to record | C | CFG-074 | R-05 | OQ-18 | ☐ | |
| URS-042 | Re-auth at signing | C | CFG-067 | R-05 | OQ-17 | ☐ | |
| URS-043 | Tamper invalidates signature | H | CFG-074 | R-05/R-08 | OQ-18 | ☐ | |
| URS-050 | Raise query | H | CFG-023 | R-07 | OQ-23, PQ-05 | ☐ | |
| URS-051 | Query state tracked | H | CFG-023-025 | R-07 | OQ-24, PQ-07 | ☐ | |
| URS-052 | Query exchange audited | H | CFG-024-025 | R-07 | OQ-24, PQ-06 | ☐ | |
| URS-060 | Record locking | C | CFG-027,074 | R-08 | OQ-25, PQ-10 | ☐ | |
| URS-061 | Locked record protected; unlock audited | C | CFG-028 | R-08 | OQ-26, PQ-11 | ☐ | |
| URS-062 | ALCOA maintained | C | (whole config) | R-03/R-12 | PQ §4 | ☐ | |
| URS-070 | Structured export | H | CFG-029 | R-12 | OQ-31, PQ-12 | ☐ | |
| URS-071 | Export integrity vs source | C | CFG-029 | R-12 | OQ-31, PQ-13 | ☐ | |
| URS-072 | Human-readable record + audit | H | CFG-070 | R-03 | PQ-14, OQ-19 | ☐ | |
| URS-080 | Scheduled backup | C | CFG (SOP-002) | R-11 | OQ-29, IQ-19 | ☐ | |
| URS-081 | Tested restore | C | (SOP-002) | R-11 | OQ-30 | ☐ | |
| URS-082 | System logging | M | CFG-020 | R-15 | IQ-20 | ☐ | |
| URS-090 | Retention period | H | (SOP-003) | R-03 | reviewed in periodic review | ☐ | |
| URS-091 | Records readable through retention | H | CFG-029 | R-12 | OQ-31, PQ-14 | ☐ | |

## 3. Coverage Check
- URS requirements: **39** · all mapped to ≥1 test → **no coverage gaps**.
- Every OQ case (OQ-01…31) and PQ step traces back to ≥1 URS → **no orphan tests**.
- Priority **C** requirements all map to **scripted** OQ/PQ cases (consistent with VQ-005 §3).

## 4. Result Roll-up (completed at execution)
| Metric | Value |
|---|---|
| Requirements verified Pass | ___ / 39 |
| Requirements with open deviation | ___ |
| Requirements accepted as residual risk (QA) | ___ |
