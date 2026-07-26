# SOP-002 — Backup and Restore

| Field | Value |
|---|---|
| Document ID | SOP-002 |
| Version | 1.0 |
| Effective Date | 2026-07-25 |
| Author | A. Hassan |
| System | OpenClinica CE — Study NWT-ORX201-201 |
| Review cycle | Annual |

### Approval
| Role | Name | Signature | Date |
|---|---|---|---|
| Author | A. Hassan | __________ | ______ |
| IT/Infrastructure | __________ | __________ | ______ |
| QA | __________ | __________ | ______ |

---

## 1. Purpose
Ensure clinical data and its audit trail are regularly backed up, backups are secure and verifiable, and the system is restorable to a known-good state. Supports Part 11 §11.10(c); Annex 11 §7.2, §16, §17.

## 2. Scope
PostgreSQL database (study data + audit trail), application configuration, container definitions (compose file + pinned image digests), and CRF/rule definitions.

## 3. Responsibilities
- **IT/Infrastructure:** performs backups, verifies integrity, executes restores.
- **System Owner:** confirms backup schedule adequacy; approves restore in production.
- **QA:** reviews restore-test records.

## 4. Procedure

### 4.1 Backup schedule (RPO)
- **Daily** automated `pg_dump` of the OpenClinica database to secure storage.
- **Weekly** full backup including configuration, compose file, and recorded image digests.
- Target **Recovery Point Objective (RPO): ≤ 24 hours**.

### 4.2 Backup integrity (Annex 11 §7.2)
- After each backup, record file name, size, timestamp, and a **checksum (SHA-256)**.
- Verify the dump is non-empty and completes without error; log the result.
- Store backups on separate media/location from the live system; restrict access.

### 4.3 Retention
Retain backups per the study retention policy; never below the regulatory record-retention period. Older backups rotated per schedule, not deleted before retention expiry.

### 4.4 Restore procedure
1. Provision a clean OpenClinica instance from the pinned image digests (per VQ-006 IQ).
2. Restore the database dump; apply configuration backup.
3. **Verify:** confirm a known reference subject and **its audit trail** are intact; reconcile record counts pre/post; confirm application starts and login works.
4. Record who restored, from which backup, date-time, and verification outcome.

### 4.5 Restore testing (Annex 11 §16 / OQ-30)
- Perform a **documented restore rehearsal at least annually** (and after any major change) to a non-production instance.
- Record **Recovery Time Objective (RTO)** achieved; target **RTO: ≤ 4 hours**.

### 4.6 Business continuity link
If the system is unavailable beyond RTO, invoke the Business Continuity Plan (paper-CRF fallback; contingency migration to LibreClinica/OC4). Reconcile paper data into the system on recovery, with audit-trail annotation.

## 5. Records
Backup logs with checksums; restore-test records with RTO; incident cross-references. Retained per policy.

## 6. References
VQ-006 IQ; VQ-007 OQ-29/30; SOP-005; Annex 11 §7.2/§16/§17.
