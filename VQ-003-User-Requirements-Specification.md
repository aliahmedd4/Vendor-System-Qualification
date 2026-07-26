# VQ-003 — User Requirements Specification (URS)

| Field | Value |
|---|---|
| Document ID | VQ-003 |
| Title | User Requirements Specification — EDC for Study NWT-ORX201-201 |
| Version | 1.0 |
| Status | Approved |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead (on behalf of Sponsor Clinical Data Management) |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner (CDM) | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Context

**Sponsor:** Northwind Therapeutics, Inc. **Protocol:** NWT-ORX201-201 — *A Phase II, randomised, double-blind, placebo-controlled study to evaluate the efficacy and safety of ORX-201 in adults with moderate-to-severe plaque psoriasis.* Target enrolment for the mock qualification study: **10 subjects**, one site.

> **Regulatory reasoning — why the URS comes first and stays "solution-neutral where it can."** The URS states *what the sponsor needs*, expressed as testable requirements, independent of how OpenClinica happens to implement them. This keeps the acceptance bar owned by the sponsor, not the vendor. Each requirement is **atomic** (one testable idea), **uniquely numbered** (for traceability in VQ-009), **unambiguous**, and carries a **risk/priority** hint that VQ-005 will refine. Requirements are the left-most point of the V-model; every one must trace to configuration and to at least one test.

**Convention:** `URS-nnn`. Priority: **C**ritical / **H**igh / **M**edium. "The system shall…" = mandatory.

## 2. Requirements

### 2.1 Authentication & Session Security
| ID | Requirement | Priority |
|---|---|---|
| URS-001 | The system shall require each user to authenticate with a unique username and password before any access to study data. | C |
| URS-002 | The system shall not permit shared or generic accounts for data-affecting actions. | C |
| URS-003 | The system shall enforce a password policy of minimum length ≥ 8 with complexity, and password expiry. | H |
| URS-004 | The system shall lock a user account after a defined number of consecutive failed login attempts. | H |
| URS-005 | The system shall automatically terminate or lock an inactive session after a defined timeout period, requiring re-authentication. | H |
| URS-006 | The system shall not display the password in clear text during entry or storage. | C |

### 2.2 Authorisation & Role-Based Access Control
| ID | Requirement | Priority |
|---|---|---|
| URS-010 | The system shall support distinct user roles at minimum: Administrator, Data Manager, Clinical Research Associate/Monitor, Data Entry, Investigator. | C |
| URS-011 | The system shall restrict each function (enter, edit, query, sign, lock, export, user admin) to authorised roles per the permission matrix in VQ-004. | C |
| URS-012 | The system shall prevent a Data Entry user from performing administrative functions (e.g. user creation, study setup). | C |
| URS-013 | The system shall permit only an Investigator (or delegated signatory) role to apply an electronic signature to sign-off records. | C |
| URS-014 | The system shall scope a user's data access to the studies/sites to which they are assigned. | H |

### 2.3 Data Entry & Edit Checks
| ID | Requirement | Priority |
|---|---|---|
| URS-020 | The system shall present study-specific Case Report Forms (CRFs) for scheduled visits. | H |
| URS-021 | The system shall enforce field-level data-type and range constraints (e.g. numeric ranges, required fields). | C |
| URS-022 | The system shall automatically fire configured edit checks and raise a discrepancy when entered data violates a rule. | C |
| URS-023 | The system shall prevent saving of data that violates a hard (blocking) edit check, or flag a soft check for review, per configuration. | H |
| URS-024 | The system shall support scheduled study events/visits per the protocol schedule of assessments. | M |

### 2.4 Audit Trail
| ID | Requirement | Priority |
|---|---|---|
| URS-030 | The system shall maintain a secure, computer-generated, time-stamped audit trail of create, modify, and delete actions on study data, without obscuring previously recorded information. | C |
| URS-031 | For each change the audit trail shall record: the **old value**, the **new value**, the **user identity**, the **date-time stamp**, and a **reason for change**. | C |
| URS-032 | The audit trail shall not be editable or deletable by any user through the application. | C |
| URS-033 | The system shall retain the audit trail for the record retention period and make it available for inspection/export. | H |

### 2.5 Electronic Signatures
| ID | Requirement | Priority |
|---|---|---|
| URS-040 | The system shall allow authorised users to electronically sign records, capturing signer identity, date-time, and the meaning of the signature (e.g. "approved"). | C |
| URS-041 | The system shall link each electronic signature to its record such that it cannot be excised, copied, or transferred to falsify another record. | C |
| URS-042 | The system shall require the signer to re-authenticate (credential) at the point of signing, or maintain a controlled continuous session per §11.200. | C |
| URS-043 | The signed status shall be visible and the signed record protected from silent alteration (any change invalidates/flags the signature). | H |

### 2.6 Query / Discrepancy Management
| ID | Requirement | Priority |
|---|---|---|
| URS-050 | The system shall allow a Data Manager/Monitor to raise a query against a data point. | H |
| URS-051 | The system shall track query state (open → answered → closed) with attribution and timestamps. | H |
| URS-052 | The system shall allow site users to respond to queries and Data Management to close them, with the full exchange retained in the audit trail. | H |

### 2.7 Record Locking & Data Integrity
| ID | Requirement | Priority |
|---|---|---|
| URS-060 | The system shall support locking/freezing of a CRF or subject casebook to prevent further modification after review/sign-off. | C |
| URS-061 | The system shall prevent modification of locked records except via a controlled unlock action that is itself audited. | C |
| URS-062 | The system shall ensure data are attributable, legible, contemporaneous, original and accurate (ALCOA) throughout the lifecycle. | C |

### 2.8 Extract / Reporting
| ID | Requirement | Priority |
|---|---|---|
| URS-070 | The system shall export the study dataset in a documented, structured format (e.g. CDISC ODM/XML, CSV, or tab-delimited) for statistical analysis. | H |
| URS-071 | The exported data shall faithfully match the data of record (integrity of extract verifiable against source). | C |
| URS-072 | The system shall be able to produce a human-readable copy of a subject's records and their audit trail for inspection. | H |

### 2.9 Backup, Restore & Availability
| ID | Requirement | Priority |
|---|---|---|
| URS-080 | The system's data shall be backed up on a defined schedule, with backups stored securely. | C |
| URS-081 | The system shall be restorable from backup to a known-good state, and the restore procedure shall be tested. | C |
| URS-082 | The system shall log system-level events sufficient to support incident investigation. | M |

### 2.10 Data Retention & Records
| ID | Requirement | Priority |
|---|---|---|
| URS-090 | The system shall retain electronic records and their audit trails for at least the regulatory retention period applicable to the trial. | H |
| URS-091 | Records shall remain readable and exportable throughout the retention period. | H |

## 3. Traceability
Every requirement above is carried into VQ-009 (RTM) and mapped to a VQ-004 configuration item and one or more VQ-007/VQ-008 test cases. Requirements with priority **C** map to **scripted** tests (VQ-005 rationale).
