# VQ-010 — 21 CFR Part 11 Gap Assessment

| Field | Value |
|---|---|
| Document ID | VQ-010 |
| Title | 21 CFR Part 11 Gap Assessment — OpenClinica CE |
| Version | 1.0 |
| Status | Approved |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Purpose & Approach

A **clause-by-clause** assessment against 21 CFR Part 11 (Electronic Records; Electronic Signatures). For each clause: the requirement, how OpenClinica CE meets it (**Met / Partial / Gap**), and — where the software falls short — the **compensating procedural control** that closes the risk. Compliance is a property of *system + procedures + people*, not software alone.

> **Regulatory reasoning — technical vs procedural controls.** Part 11 rarely demands a *feature*; it demands an *outcome* (records are trustworthy, signatures are attributable, access is controlled). An outcome can be achieved by a technical control (software enforces it) or a procedural control (an SOP + training + records enforce it), or both. Where CE can't enforce something technically, a well-designed, followed, and evidenced SOP is a legitimate compensating control — **provided** the residual risk is acceptable and the control is auditable. Being honest about which controls are procedural is exactly what an FDA investigator wants to see; hiding a gap is worse than having one. This assessment also reflects FDA's **CSA** posture: focus assurance effort on the records and controls that matter to product quality and patient safety.

**Legend:** ✅ Met (technical) · 🟡 Partial (technical + procedural needed) · ❌ Gap (procedural control required) · N/A.

## 2. Subpart B — Electronic Records

### §11.10 Controls for closed systems

| Clause | Requirement | Status | Assessment & Compensating Control |
|---|---|:--:|---|
| 11.10(a) | Validation to ensure accuracy, reliability, consistent intended performance, ability to discern altered records | 🟡 | This entire VQ package **is** the validation. Software supports it; the *evidence* is procedural. OQ-11..15 + PQ-13 discern altered records. Control: maintain validated state via **SOP-004**. |
| 11.10(b) | Ability to generate accurate, complete copies (human-readable + electronic) | ✅ | Casebook print + ODM/CSV export (OQ-19, OQ-31, PQ-12/14). |
| 11.10(c) | Protection of records to enable retrieval throughout retention period | 🟡 | App retains data; long-term retention/readability on an **EOL stack** is a risk (VQ-002 R-15). Control: **SOP-003 Periodic Review** + backup/archival **SOP-002**; documented migration plan (LibreClinica/OC4 contingency). |
| 11.10(d) | Limiting system access to authorised individuals | ✅ | RBAC + permission matrix (OQ-06..10); reinforced by **SOP-001**. |
| 11.10(e) | Secure, computer-generated, time-stamped audit trails; do not obscure prior records; retained | ✅ | Native audit trail with old/new/user/time/reason (OQ-11..14); immutability OQ-15/IQ-13. **This is CE's strongest Part 11 feature.** |
| 11.10(f) | Operational system checks to enforce permitted sequencing | 🟡 | Study events/workflow enforce sequence partially. Control: procedural workflow in **SOP** + DM review for steps not system-enforced. |
| 11.10(g) | Authority checks — only authorised users perform actions/sign | ✅ | Role checks + signer restriction (OQ-07, OQ-16). |
| 11.10(h) | Device (terminal) checks where relevant | N/A/🟡 | Not a data-source-device system. Control: network restriction (CFG-003) + **SOP-001** authorised-workstation guidance. |
| 11.10(i) | Persons have education/training/experience | ❌→proc | Not a software feature. Control: **training records SOP** (part of SOP-001) — users trained & documented before access. |
| 11.10(j) | Written policy holding individuals accountable for e-sign actions | ❌→proc | Procedural by nature. Control: signed **e-signature accountability policy** + user agreement (SOP-001). |
| 11.10(k) | Controls over systems documentation (distribution, change control, audit trail of changes) | 🟡 | Doc/version control is procedural. Control: **SOP-004 Change Control** + this document-controlled package. |

### §11.30 Controls for open systems
| Clause | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 11.30 | Additional controls (encryption, digital signatures) if open system | 🟡 | Deployment is a **closed system** (internal network, controlled access, CFG-003), so §11.30 is largely N/A — **but** TLS in transit is still required and CE does not provide TLS natively. Control: **TLS terminated at reverse proxy (CFG-002)**; verified IQ-14. |

### §11.50 Signature manifestations
| Clause | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 11.50(a) | Signed records show printed name, date/time, and meaning of signature | ✅/🟡 | Signature captures identity, time, meaning (OQ-16, OQ-19). Verify the *meaning* text is configured and appears in output; if partial, add procedural annotation. |
| 11.50(b) | This info included in human-readable copies | ✅ | Included in casebook export (OQ-19, PQ-14). |

### §11.70 Signature/record linking
| Clause | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 11.70 | Signatures linked to records so they can't be excised/copied/transferred to falsify | 🟡 | Signature bound to casebook; change invalidates (OQ-18). Cryptographic binding is weaker than a true digital signature. Control: **audit trail + record locking (OQ-25/26)** + DB access restriction (SOP-001) make undetected transfer implausible. Residual risk documented & accepted. |

## 3. Subpart C — Electronic Signatures

| Clause | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 11.100(a) | Each e-signature unique to one individual, not reused/reassigned | ✅/🟡 | Unique user accounts (OQ-05). Control: **SOP-001** forbids account reassignment; deactivate-don't-reuse policy. |
| 11.100(b) | Verify identity of individual before establishing signature | ❌→proc | Procedural — software can't verify a person's real-world identity. Control: **SOP-001 identity-verification step** before account issuance (documented). |
| 11.100(c) | Certify to FDA that e-signatures are legally binding (one-time certification) | ❌→proc | Organisational filing to FDA. Control: sponsor submits the **§11.100(c) certification letter**; referenced here. |
| 11.200(a) | Non-biometric signatures use ≥2 components (ID + password); rules for series vs single signings | 🟡 | Username + password = two components. Re-auth at signing (OQ-17). Verify behaviour for a continuous signing session vs each-signing per 11.200(a)(1); enforce procedurally if software doesn't. |
| 11.200(b) | Biometric signatures ensure not usable by others | N/A | No biometrics used. |
| 11.300(a) | Uniqueness of ID/password combination | ✅ | Unique usernames enforced. |
| 11.300(b) | Passwords periodically checked/revised/expired | 🟡 | Expiry configurable (CFG-062). Verify strength of enforcement; supplement with **SOP-001** password lifecycle. |
| 11.300(c) | Loss-management procedure (deauthorise lost/compromised tokens/passwords) | ❌→proc | Procedural. Control: **SOP-005 Incident Management** + SOP-001 credential-reset/deactivation process. |
| 11.300(d) | Transaction safeguards to prevent unauthorised use; detect & report attempts | 🟡 | Account lockout (OQ-28) + logs. Detection/reporting is procedural. Control: **SOP-005** monitoring & reporting of failed-access patterns. |
| 11.300(e) | Periodic testing of tokens/devices | N/A | No hardware tokens. |

## 4. Gap Summary & Dispositions

| # | Clause | Nature of gap | Compensating control | Residual risk |
|---|---|---|---|---|
| G1 | 11.30 / TLS | No native TLS in CE | Reverse-proxy TLS (CFG-002), IQ-14 | Low |
| G2 | 11.70 | Non-cryptographic signature binding | Audit trail + locking + DB restriction | Low–Med (accepted) |
| G3 | 11.100(b), 11.10(i) | Identity verification & training not software-enforced | SOP-001 (identity, training records) | Low |
| G4 | 11.100(c) | FDA certification is organisational | Sponsor certification letter | Low |
| G5 | 11.300(c/d) | Credential-loss & attempt-reporting procedural | SOP-005 + SOP-001 | Low |
| G6 | 11.10(c) | Long-term readability on EOL stack | SOP-003 review + migration contingency | **Medium (accepted, monitored)** |
| G7 | 11.10(j), 11.10(k) | Accountability policy & doc control procedural | SOP-004 + e-sig accountability policy | Low |
| G8 | CFG-061/066 | CE password complexity/hashing may be weak vs target | Harden config; if not hardenable, SOP-001 + monitoring; document | Med → verify at IQ-11/OQ-03 |

## 5. Conclusion
OpenClinica CE **substantially meets** Part 11's electronic-records core — its audit trail (§11.10(e)) and access controls are genuine strengths. The residual gaps are predominantly **procedural by nature** (training, identity verification, FDA certification, credential-loss handling) and are closed by SOP-001…005, **except G6 (technology obsolescence)** and **G8 (password hardening)**, which are technical and carry accepted, monitored residual risk. With the listed compensating controls implemented and evidenced, the system can be operated in a Part 11-compliant manner for the intended use. **No gap is left undisposed.**
