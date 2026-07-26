# SOP-005 — Incident Management

| Field | Value |
|---|---|
| Document ID | SOP-005 |
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
Ensure system incidents (failures, security events, data-integrity events, unauthorised-access attempts) are recorded, assessed, resolved, and root-caused. This is an **explicit Annex 11 §13 requirement with no direct Part 11 equivalent**, and supports Part 11 §11.300(c)(d).

## 2. Scope
Any unplanned event affecting the availability, integrity, security, or compliant operation of OpenClinica CE — including suspected data-integrity issues, failed logins/lockouts patterns, backup failures, and stack/security vulnerabilities (relevant given the EOL runtime, VQ-002 R-15).

## 3. Responsibilities
- **Any user:** reports a suspected incident promptly.
- **System Owner:** triages, classifies severity, coordinates response.
- **IT/Admin:** performs technical containment/recovery.
- **QA:** oversees data-integrity incidents, approves closure, drives CAPA.

## 4. Procedure

### 4.1 Report & log
Record: date-time discovered, reporter, description, systems/data affected, immediate symptoms. Assign an Incident ID.

### 4.2 Classify severity
| Severity | Definition | Response |
|---|---|---|
| Critical | Data-integrity loss/falsification, breach of PHI, unauthorised data change, prolonged outage | Immediate; QA + System Owner engaged; consider study-team/sponsor notification |
| Major | Contained security event, backup failure, significant malfunction | Same-day |
| Minor | Transient issue, no data impact | Routine |

### 4.3 Contain & recover
- Contain (e.g. disable compromised account per SOP-001; isolate host).
- Recover using SOP-002 (restore) if data affected; verify integrity post-recovery.
- Preserve evidence (logs, audit trail) before remediation where feasible.

### 4.4 Data-integrity assessment
For any event that could have altered records: review the **audit trail** to determine what changed, when, and by whom; determine whether records of record are affected; document the integrity conclusion. QA sign-off required.

### 4.5 Root cause & CAPA (Annex 11 §13)
Determine root cause; define corrective action (fix the instance) and preventive action (stop recurrence). Where the cause is the EOL stack, evaluate escalation of the migration/contingency plan (LibreClinica/OC4).

### 4.6 Close
QA reviews resolution, integrity conclusion, and CAPA; approves closure. Link to SOP-004 if a change is required, and to SOP-003 (trends reviewed at periodic review).

## 5. Incident Log
| Inc ID | Date | Severity | Description | Data-integrity impact | Root cause | CAPA | Status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## 6. Records
Incident reports, integrity assessments, CAPA records, notifications. Retained per policy.

## 7. References
Annex 11 §13; Part 11 §11.300(c)(d); SOP-001/002/003/004.
