# VQ-004 — Configuration Specification

| Field | Value |
|---|---|
| Document ID | VQ-004 |
| Title | Configuration Specification — OpenClinica CE for Study NWT-ORX201-201 |
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

## 1. Purpose

To document **every configuration decision** applied to the standard OpenClinica CE product to make it fit for Study NWT-ORX201-201. This is the specification that OQ (VQ-007) verifies and that VQ-009 traces requirements to.

> **Regulatory reasoning.** In a GAMP 5 Category 4 system, *configuration is the thing you own and must prove.* An inspector will ask: "Show me what you set, why, who approved it, and the evidence it is set that way." Undocumented configuration = unvalidated configuration. Each item below has an ID (`CFG-nnn`), the setting, the rationale, and the URS requirement it satisfies. Values marked **[verify @ IQ/OQ]** are confirmed against the live system during execution — the spec states the intended value; execution records the actual.

## 2. Environment Configuration (summary; full build in VQ-006 IQ)

| CFG ID | Item | Specified value | Satisfies |
|---|---|---|---|
| CFG-001 | Deployment model | Single-host Docker: OpenClinica CE container + PostgreSQL container | — |
| CFG-002 | Access protocol | HTTPS/TLS to be terminated at reverse proxy; HTTP disabled externally | URS-006, Part 11 §11.30 |
| CFG-003 | Network exposure | Bound to internal network only; no public internet exposure | VQ-005 mitigation |
| CFG-004 | Timezone / clock source | Host synced to NTP; application TZ = UTC | URS-031 (trustworthy timestamps) |

## 3. User Roles

OpenClinica CE ships a role model spanning **Business Admin / Study Director / Data Specialist (Manager)** at study level and **Investigator / Clinical Research Coordinator / Monitor / Data Entry** at site level. Northwind maps its required roles onto these as follows.

| CFG ID | Northwind role | OpenClinica role mapping | Scope | Satisfies |
|---|---|---|---|---|
| CFG-010 | Administrator | Business Admin (technical/user admin) | System | URS-010, URS-012 |
| CFG-011 | Data Manager | Study Director / Data Manager | Study | URS-010, URS-050 |
| CFG-012 | CRA / Monitor | Monitor | Site | URS-010, URS-050 |
| CFG-013 | Data Entry | Clinical Research Coordinator / Data Entry Person | Site | URS-010 |
| CFG-014 | Investigator (Signatory) | Investigator | Site | URS-010, URS-013, URS-040 |

## 4. Permission Matrix

`Y` = permitted, `—` = denied. This matrix is the authoritative statement OQ enforces (positive **and** negative tests).

| Function | Administrator | Data Manager | CRA/Monitor | Data Entry | Investigator |
|---|:---:|:---:|:---:|:---:|:---:|
| Create/manage users (CFG-020) | Y | — | — | — | — |
| Study/CRF setup (CFG-021) | Y | Y | — | — | — |
| Enter/edit subject data (CFG-022) | — | Y | — | Y | — |
| Raise query (CFG-023) | — | Y | Y | — | — |
| Answer query (CFG-024) | — | Y | — | Y | Y |
| Close query (CFG-025) | — | Y | — | — | — |
| Electronic sign-off (CFG-026) | — | — | — | — | Y |
| Lock/freeze CRF (CFG-027) | — | Y | — | — | — |
| Unlock CRF (CFG-028) | Y | Y | — | — | — |
| Extract dataset (CFG-029) | Y | Y | — | — | — |
| View audit trail (CFG-030) | Y | Y | Y | — | Y |

> **Design note.** Segregation of duties is deliberate: the signer (Investigator) cannot also administer users or unlock their own signed records; Data Entry cannot self-approve. This satisfies URS-011/012/013 and supports Part 11 §11.10(d) (limiting access to authorised individuals) and §11.10(g) (authority checks).

## 5. Study Setup (CFG-040 series)

| CFG ID | Item | Specified value | Satisfies |
|---|---|---|---|
| CFG-040 | Study identifier | NWT-ORX201-201 | URS-020 |
| CFG-041 | Sites | Single site: SITE-01 | URS-014 |
| CFG-042 | Study events (visits) | Screening, Baseline (Randomisation), Week 4, Week 8, Week 12 (EoT), Early Termination | URS-024 |
| CFG-043 | Subject ID format | `S-###` (S-001 … S-010) | URS-020 |
| CFG-044 | CRFs per visit | Demographics, Vital Signs, PASI Score, Adverse Events, Concomitant Meds, Study Drug Administration | URS-020 |
| CFG-045 | Enrolment arms | 1:1 ORX-201 vs Placebo (blinded) | protocol |

### 5.1 CRF Field Constraints (examples; full CRF definitions attached to IQ as loaded artefacts)
| CFG ID | Field | Constraint | Satisfies |
|---|---|---|---|
| CFG-046 | Vital Signs — Systolic BP | Integer 60–250 mmHg; required | URS-021 |
| CFG-047 | Vital Signs — Heart Rate | Integer 30–220 bpm; required | URS-021 |
| CFG-048 | Demographics — DOB | Valid date; not future | URS-021 |
| CFG-049 | PASI — Total score | Decimal 0.0–72.0 | URS-021 |

## 6. Edit Checks / Rules (CFG-050 series)

| CFG ID | Rule | Type | Behaviour | Satisfies |
|---|---|---|---|---|
| CFG-050 | Systolic BP outside 60–250 | Range (hard) | Block save + raise discrepancy | URS-022, URS-023 |
| CFG-051 | Heart Rate outside 30–220 | Range (hard) | Block save + raise discrepancy | URS-022 |
| CFG-052 | Diastolic ≥ Systolic | Logical (soft) | Flag discrepancy, allow save with review | URS-022 |
| CFG-053 | Required field left blank | Required | Block save | URS-021 |
| CFG-054 | AE end date < AE start date | Logical (hard) | Block + discrepancy | URS-022 |
| CFG-055 | PASI total ≠ sum of regional sub-scores | Consistency (soft) | Flag discrepancy | URS-022 |

## 7. Security Parameters

| CFG ID | Parameter | Specified value | Satisfies | Notes |
|---|---|---|---|---|
| CFG-060 | Minimum password length | 8 characters | URS-003 | |
| CFG-061 | Password complexity | ≥1 upper, ≥1 lower, ≥1 digit; non-reuse of last N | URS-003 | CE default may be weaker — **hardening item**, see VQ-010 |
| CFG-062 | Password expiry | 90 days | URS-003 | |
| CFG-063 | Account lockout threshold | 5 consecutive failed attempts | URS-004 | |
| CFG-064 | Lockout handling | Account locked; admin reset required (or timed unlock per config) | URS-004 | |
| CFG-065 | Session inactivity timeout | 15 minutes → session invalidated, re-auth required | URS-005 | Set via Tomcat `web.xml` `<session-timeout>` and/or app config |
| CFG-066 | Password storage | Hashed (non-reversible) | URS-006 | Verify hashing algorithm at IQ; weak legacy hashing = VQ-010 gap |
| CFG-067 | Concurrent session policy | Documented; re-auth at signing enforced | URS-042 | |

> **Honesty note.** Several CE defaults (e.g. password complexity strength, hashing algorithm, native TLS) may not meet CFG targets out of the box. Where the software cannot be configured to meet a requirement, the shortfall is recorded as a **gap with a compensating procedural control** in VQ-010, not silently "passed." This is the crux of an honest qualification.

## 8. Audit Trail & Signature Configuration

| CFG ID | Item | Specified value | Satisfies |
|---|---|---|---|
| CFG-070 | Audit trail | Enabled globally; captures create/modify/delete with old value, new value, user, timestamp, reason | URS-030, URS-031 |
| CFG-071 | Reason-for-change prompt | Required on modification of saved data | URS-031 |
| CFG-072 | Audit trail immutability | No application path to edit/delete audit entries; DB access restricted (SOP-001) | URS-032 |
| CFG-073 | E-signature meaning | "I approve — reviewed and correct" captured at Investigator sign-off | URS-040 |
| CFG-074 | Sign-off locks record | Signed casebook transitions to signed/locked status | URS-043, URS-060 |

## 9. Configuration Change Control
All items above are baseline for release. Post-release changes follow **SOP-004 Change Control**; the affected CFG item, its OQ re-test, and RTM update are mandatory before the change is effective.
