# VQ-012 — Deviation Log

| Field | Value |
|---|---|
| Document ID | VQ-012 |
| Title | Deviation Log — OpenClinica CE Qualification |
| Version | 1.0 (living document during execution) |
| Status | Open — populated during IQ/OQ/PQ execution |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval / Review

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Purpose & How to Use

A deviation is any result that does **not** match the expected result in an approved protocol, or any departure from the approved method. Each is logged, assessed for impact (patient safety / data integrity / product quality), dispositioned, and — where needed — assigned a CAPA before the validation can be declared complete.

> **Regulatory reasoning.** Deviations are not failures of the validation — *hiding* them is. Contemporaneous, honest deviation logging is a positive inspection signal: it shows the process is real and that problems are caught and controlled. Each entry needs an **impact assessment** (so severity drives urgency), a **disposition** (corrected / justified-acceptable / residual-risk-accepted), and **traceability** to the protocol step and any RTM row affected.

**Disposition types:** *Corrected & retested* · *Justified acceptable (no action)* · *Compensating control* · *Residual risk accepted (QA)*.

## 2. Status of This Log

> **Transparency note.** The system has **not yet been executed** at the time of writing. The entries below are **anticipated deviations** — issues that are *predictable with high confidence* from OpenClinica CE's documented characteristics (see VQ-002 Supplier Assessment and VQ-010 Part 11 gaps). They are pre-loaded so the team knows what to watch for and has a disposition path ready. **At execution, each is confirmed (observed/not-observed), and genuinely new deviations are appended.** Anticipated entries are marked `[ANTICIPATED]`; confirmed ones will be updated to `[CONFIRMED]` or `[NOT OBSERVED]` with evidence.

## 3. Deviation Register

| Dev ID | Source step | Status | Description | Impact assessment | Disposition | CAPA / Control | RTM ref |
|---|---|---|---|---|---|---|---|
| DEV-001 | IQ-14 / §11.30 | `[ANTICIPATED]` | OpenClinica CE serves over HTTP; **no native TLS**. | Data-integrity/confidentiality in transit — Medium if unmitigated. | Compensating control | Terminate TLS at reverse proxy (CFG-002); disable external HTTP; re-verify IQ-14. | URS-006 |
| DEV-002 | IQ-04/05, IQ-09 | `[ANTICIPATED]` | Runtime stack (Java 7 / Tomcat 7 / PostgreSQL 9.x) is **end-of-life**; security patches unavailable. | System-compromise risk — Medium/High (VQ-005 R-15). | Residual risk accepted (QA) + control | Network isolation (CFG-003); SOP-004/005; documented migration contingency (LibreClinica/OC4). | URS-082 |
| DEV-003 | OQ-04 / OQ-03 | `[ANTICIPATED]` | CE default **password complexity/expiry weaker** than CFG-060-062 targets; hashing algorithm to be confirmed. | Credential-compromise — Medium (R-01/R-14). | Corrected (harden config) or compensating control | Apply strongest available policy; if target unreachable in software, enforce via SOP-001 + monitoring; document. | URS-003, URS-006 |
| DEV-004 | IQ-04/05 | `[ANTICIPATED]` | Turnkey community Docker images are **dated / tags mutable**; provenance not vendor-signed. | Reproducibility/supply-chain — Medium. | Compensating control | **Pin by SHA-256 digest** (IQ-04/05), store compose+digests under change control, scan image for CVEs. | — |
| DEV-005 | OQ-17 / §11.200 | `[ANTICIPATED]` | Signing during a continuous session may not force re-auth on **every** signing (vs first). | E-signature integrity — Medium (R-05). | Compensating control / config | Configure per-signing credential if available; else procedural rule (SOP-001) + short session timeout (CFG-065). | URS-042 |
| DEV-006 | §11.70 / OQ-18 | `[ANTICIPATED]` | Signature binding is application-level, **not cryptographic**. | Falsification-by-transfer — Low/Med, low likelihood. | Residual risk accepted (QA) | Audit trail + record locking + DB access restriction make undetected transfer implausible. | URS-041 |
| DEV-007 | Annex 11 §3.2 | `[ANTICIPATED]` | **No supplier quality/support agreement** exists for free CE. | Support/maintenance continuity — Medium. | Residual risk accepted (QA) + control | Documented decision to run unsupported OSS; SOP-004/005 carry maintenance; Enterprise procurement is the escalation path. | — |
| DEV-008 | Annex 11 §16 | `[ANTICIPATED]` | Business Continuity Plan not yet formalised. | Availability of critical process — Medium. | CAPA (open) | Author BCP: backup/restore RTO/RPO + paper-CRF fallback + fork/Enterprise contingency. | URS-080/081 |
| DEV-nnn | (execution) | | *(append genuinely new deviations found during IQ/OQ/PQ here)* | | | | |

## 4. Deviation Metrics (completed at execution)
| Metric | Count |
|---|---|
| Total deviations | ___ |
| Confirmed at execution | ___ |
| Not observed (closed) | ___ |
| Critical (patient safety / integrity) unresolved | ___ (**must be 0 for release**) |
| Open CAPAs at release | ___ |

## 5. Release Gate
The validation **cannot be declared complete (VQ-013)** while any deviation with **critical** patient-safety or data-integrity impact remains without an effective, QA-approved disposition. All others must be either corrected, justified, controlled, or formally accepted as residual risk by QA.
