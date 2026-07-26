# VQ-005 — Risk Assessment (FMEA)

| Field | Value |
|---|---|
| Document ID | VQ-005 |
| Title | Risk Assessment (FMEA) — OpenClinica CE for Study NWT-ORX201-201 |
| Version | 1.0 |
| Status | Approved |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner (CDM) | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Purpose & Method

A Failure Mode and Effects Analysis (FMEA) focused on **patient safety, product quality, and data integrity**. The output **drives test strategy**: high-RPN functions receive scripted OQ/PQ testing; low-RPN functions receive lighter verification. This operationalises GAMP 5's risk-based principle and the FDA **Computer Software Assurance (CSA)** mindset — *effort follows risk*.

### 1.1 Scoring scale (1–5)
- **Severity (S)** — harm if the failure occurs: 5 = direct patient-safety impact or undetected data falsification affecting submission; 3 = data-integrity impact detectable/correctable; 1 = cosmetic/usability.
- **Occurrence (O)** — likelihood: 5 = expected without control; 1 = highly unlikely.
- **Detectability (D)** — chance it goes *un*detected: 5 = would not be noticed; 1 = immediately obvious/blocked.
- **RPN = S × O × D** (max 125).

### 1.2 Action thresholds
| RPN | Risk class | Test strategy |
|---|---|---|
| ≥ 45, or S = 5 regardless of RPN | **High** | **Scripted OQ + PQ**, positive & negative cases, evidence from audit trail/DB |
| 20–44 | **Medium** | Scripted OQ, standard evidence |
| < 20 | **Low** | Lighter verification / challenge test / covered indirectly by PQ |

> **Regulatory reasoning — why "S = 5 forces scripting regardless."** Some failures are so consequential (a broken audit trail, a bypassable signature, wrong-patient data) that even a *low estimated probability* does not justify light testing. Severity acts as an override so a convenient low Occurrence score can't be used to argue away rigorous testing of a safety/integrity-critical function. Inspectors specifically look for this discipline.

## 2. FMEA Table

| # | Function / URS | Failure mode | Effect (safety/quality/integrity) | S | O | D | RPN | Class | Mitigation & Test |
|---|---|---|---|:-:|:-:|:-:|:-:|---|---|
| R-01 | Authentication (URS-001/002) | Unauthorised access via shared/weak creds | Data breach; non-attributable changes | 5 | 3 | 3 | 45 | **High** | Password policy CFG-060-062; **OQ-01..05 scripted** |
| R-02 | RBAC enforcement (URS-011/012) | User performs unauthorised action (e.g. Data Entry edits config, non-signer signs) | Integrity loss; SoD breach | 5 | 3 | 4 | 60 | **High** | Permission matrix CFG-020…030; **OQ negative tests OQ-06..10** |
| R-03 | Audit trail completeness (URS-030/031) | Change recorded without old/new value, user, time, or reason | Cannot reconstruct history; falsification undetectable | 5 | 2 | 5 | 50 | **High** | CFG-070-072; **OQ-11..14 evidence pulled from audit trail** |
| R-04 | Audit trail immutability (URS-032) | Audit entries editable/deletable | Records can be silently rewritten | 5 | 1 | 5 | 25 (S=5 override) | **High** | CFG-072 + DB access control SOP-001; **OQ-15 + IQ DB-permission check** |
| R-05 | Electronic signature (URS-040/041/042) | Signature applied without re-auth, or transferable/excisable | Fraudulent approval; invalid submission | 5 | 2 | 4 | 40 (S=5 override) | **High** | CFG-073-074; **OQ-16..19 scripted** |
| R-06 | Edit checks (URS-021/022) | Out-of-range/invalid data accepted silently | Bad clinical data; safety signal missed | 4 | 3 | 3 | 36 | **Medium→scripted** | CFG-050-055; **OQ-20..22** |
| R-07 | Query workflow (URS-050-052) | Query lost / state not tracked / exchange not audited | Discrepancies unresolved; integrity gap | 3 | 3 | 3 | 27 | Medium | **OQ-23..24 + PQ** |
| R-08 | Record locking (URS-060/061) | Locked/signed record silently modified | Post-approval tampering | 5 | 2 | 4 | 40 (S=5 override) | **High** | CFG-074, CFG-027/028; **OQ-25..26** |
| R-09 | Session timeout (URS-005) | Session stays open on unattended workstation | Impersonation; non-attributable entries | 4 | 3 | 3 | 36 | Medium | CFG-065; **OQ-27** |
| R-10 | Account lockout (URS-004) | Brute-force not blocked | Credential compromise | 4 | 3 | 3 | 36 | Medium | CFG-063-064; **OQ-28** |
| R-11 | Backup/restore (URS-080/081) | Backup missing/corrupt; restore fails | Permanent data loss | 5 | 2 | 3 | 30 (S=5 override) | **High** | SOP-002; **OQ-29..30 restore rehearsal** |
| R-12 | Extract integrity (URS-070/071) | Export drops/alters data vs source | Wrong dataset analysed | 5 | 2 | 3 | 30 (S=5 override) | **High** | **PQ extract reconciliation + OQ-31** |
| R-13 | Timestamp trustworthiness (URS-031) | Server clock wrong/unsynced | Mis-sequenced audit trail | 3 | 2 | 4 | 24 | Medium | CFG-004 NTP; **IQ check** |
| R-14 | Password storage (URS-006) | Credentials weakly hashed/recoverable | Credential theft | 5 | 2 | 4 | 40 (S=5 override) | **High** | CFG-066; **IQ inspect hashing; VQ-010 gap if weak** |
| R-15 | Technology obsolescence (VQ-002) | EOL Java/Tomcat/PG unpatched vuln exploited | System compromise; integrity loss | 4 | 3 | 4 | 48 | **High** | Network isolation CFG-003; SOP-004/005; contingency = LibreClinica |
| R-16 | Basic navigation / list rendering | UI list mis-renders | Cosmetic; user notices immediately | 1 | 2 | 1 | 2 | **Low** | Lighter verification; covered by PQ usage |
| R-17 | On-screen help text wording | Minor label error | Cosmetic | 1 | 2 | 1 | 2 | **Low** | Not scripted; covered incidentally |

## 3. Risk-to-Test Strategy Summary

| Risk class | Functions | Testing decision |
|---|---|---|
| **High** (R-01…05, R-08, R-11, R-12, R-14, R-15) | Auth, RBAC, audit trail, e-signature, record locking, backup/restore, extract integrity, password storage, obsolescence | **Fully scripted**, positive + negative, native digital evidence (audit trail / DB / logs) preferred over screenshots |
| **Medium** (R-06, R-07, R-09, R-10, R-13) | Edit checks, query workflow, session timeout, lockout, clock | Scripted OQ, standard evidence |
| **Low** (R-16, R-17) | Cosmetic UI, help text | Lighter verification; no dedicated scripts; exercised during PQ |

> **This is the payoff of the whole risk exercise.** We are *not* testing everything to the same depth. The 25+ OQ cases (VQ-007) concentrate where S and RPN are high. The two Low items are explicitly *not* scripted — and that decision is documented and justified here, which is what makes skipping them defensible to an inspector. "We didn't test X" is only acceptable if you can show *why* the risk didn't warrant it.

## 4. Residual Risk

After mitigations, the dominant residual risks are (a) **technology obsolescence** (R-15) — accepted and controlled via isolation + SOPs, with LibreClinica as contingency; and (b) any **Part 11 shortfalls** the software cannot close in configuration (R-14 etc.), each carried to VQ-010 with a compensating control or a QA-accepted, documented residual risk. No residual **High** risk is left without either an effective mitigation or an explicit, signed acceptance.

## 5. Link to Other Documents
Feeds VQ-007 (OQ case selection), VQ-008 (PQ reconciliation), VQ-009 (RTM priority), VQ-010/011 (gap dispositions).
