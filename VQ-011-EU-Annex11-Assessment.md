# VQ-011 — EU Annex 11 Assessment

| Field | Value |
|---|---|
| Document ID | VQ-011 |
| Title | EU Annex 11 (Computerised Systems) Assessment — OpenClinica CE |
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

## 1. Purpose & How Annex 11 Differs from Part 11

Clause-by-clause assessment against **EudraLex Vol. 4, Annex 11 — Computerised Systems**. Same method as VQ-010 (Met / Partial / Gap + compensating control), but this document **highlights where Annex 11 imposes expectations beyond 21 CFR Part 11**, because those deltas are where a Part-11-focused package typically has holes.

> **Regulatory reasoning — the two are complementary, not identical.** Part 11 is a US FDA regulation narrowly about *electronic records and signatures*. Annex 11 is an EU GMP annex about *the whole computerised system lifecycle*. Annex 11 is broader and more explicit on several fronts an American-centric project forgets:
> - **Risk management** across the lifecycle (Annex 11 §1) — Part 11 never says "do risk management."
> - **Supplier/service-provider management and formal agreements** (§3.2) — Part 11 is silent on suppliers.
> - **Data/periodic evaluation** (§11) — explicit requirement to periodically re-evaluate the system.
> - **Business continuity** (§16) — Part 11 doesn't mandate continuity planning.
> - **IT infrastructure qualification** (§4.3) — explicit.
> - **Data integrity of transfers/interfaces and accuracy checks** (§5, §6).
> These deltas are called out with **[BEYOND P11]** below.

**Legend:** ✅ Met · 🟡 Partial (procedural) · ❌ Gap → procedural control.

## 2. Assessment

### General
| § | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 1 | **Risk management** throughout lifecycle, proportionate to risk **[BEYOND P11]** | ✅ | **VQ-005 FMEA** provides this; risk drives test depth. This is a genuine strength of the package. |
| 2 | Personnel — defined responsibilities, training, cooperation between process owners/IT/QA | 🟡 | Roles defined (VQ-001 §7). Training procedural → SOP-001. |
| 3.1 | Supplier competence & reliability = key factor in a system/service | ✅ | **VQ-002 Supplier Assessment** addresses this. |
| 3.2 | **Formal agreements** (quality/SLA) with suppliers/service providers **[BEYOND P11]** | ❌→proc | CE is free/unsupported — **no supplier agreement exists**. This is a real Annex 11 gap. Control: document the decision to run unsupported OSS; if support is needed → procure OC4/Enterprise with a quality agreement, or engage a service provider. Meanwhile **SOP-004/005** carry the maintenance burden internally. |
| 3.3 | Audit of suppliers where appropriate; documentation available | 🟡 | Desk assessment done (VQ-002 §9); audit deemed low-value for free CE — rationale documented. |
| 3.4 | Documentation supplied with COTS reviewed for requirement coverage | ✅ | Reference Guide reviewed (VQ-002 §6). |

### Project Phase
| § | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 4.1 | System validated; extent based on risk | ✅ | This VQ package; risk-based per VQ-005. |
| 4.2 | Up-to-date system inventory / lifecycle description | 🟡 | Maintain a system inventory entry. Control: register in validation master list (procedural). |
| 4.3 | **IT infrastructure qualified [BEYOND P11 emphasis]** | 🟡 | Host/Docker/DB qualified at IQ (VQ-006) and referenced infrastructure baseline. Ensure infra qualification is documented, not assumed. |
| 4.4 | URS available and traceable across lifecycle | ✅ | VQ-003 + VQ-009 RTM. |
| 4.5 | Quality/performance measures for custom systems; supplier assessed | ✅ | Cat 4 (no custom code); VQ-002. |
| 4.6 | Data migration checks (integrity/accuracy) if migrating | N/A | New study, no legacy migration. If future migration → checks required. |
| 4.7 | Automated/computerised change checks | 🟡 | Change control SOP-004. |
| 4.8 | Testing evidence & suitable environment | ✅ | OQ/PQ with defined environment. |

### Operational Phase
| § | Requirement | Status | Assessment & Control |
|---|---|:--:|---|
| 5 | **Data — accuracy checks on critical data entered manually/electronically** | ✅ | Edit checks (OQ-20..22); double-check on critical fields procedural (SOP). |
| 6 | **Accuracy checks on data transfers/interfaces** | 🟡 | Extract reconciliation (PQ-13, OQ-31). No live interfaces in scope. |
| 7.1 | Data storage — secured, integrity, accessibility | ✅/🟡 | DB access control (IQ-11/13); accessibility long-term = G6 risk (SOP-003). |
| 7.2 | **Regular backups; backup integrity checked** | ✅ | SOP-002 + OQ-29/30 restore rehearsal. |
| 8.1 | Printouts — clear, possible to obtain | ✅ | Casebook print (PQ-14). |
| 8.2 | Printouts indicate if data changed since original entry | ✅ | Audit trail shows changes (OQ-12, PQ-14). |
| 9 | **Audit trails** for GMP-relevant changes/deletions; based on risk; available & convertible to readable form; **regularly reviewed** **[BEYOND P11: explicit review duty]** | ✅/🟡 | Audit trail native (OQ-11..15). Annex 11 additionally expects **audit-trail review** — Part 11 doesn't. Control: **SOP-003 Periodic Review** mandates audit-trail review at defined frequency. |
| 10 | Change & configuration management | ✅ | SOP-004. |
| 11 | **Periodic evaluation** to confirm still valid & compliant **[BEYOND P11]** | ✅ | **SOP-003 Periodic Review** — an explicit Annex 11 requirement with no Part 11 equivalent. |
| 12.1 | Physical/logical access controls; authorised only | ✅ | RBAC + SOP-001. |
| 12.2 | Detail of security controls depends on criticality | ✅ | High-criticality → strong controls (VQ-005). |
| 12.3 | Creation/change/cancellation of access records kept | ✅/🟡 | User-management actions logged; **SOP-001** keeps access request/approval records. |
| 12.4 | Management of data & authorisations segregated appropriately (SoD) | ✅ | SoD in permission matrix (CFG). |
| 13 | **Incident management — record & assess incidents; root cause** **[BEYOND P11]** | ✅ | **SOP-005 Incident Management** — Annex 11 explicitly requires this; Part 11 does not. |
| 14 | Electronic signatures — permanently linked, include time/date | ✅/🟡 | OQ-16..19; same partials as VQ-010 §11.70. |
| 15 | Batch release (certified person) | N/A | Not a manufacturing batch-release system. |
| 16 | **Business continuity — ensure continued support of critical processes on system unavailability** **[BEYOND P11]** | 🟡 | Backup/restore (SOP-002) + LibreClinica/OC4 contingency (VQ-002). Document a **BCP**: paper-CRF fallback + recovery RTO/RPO. Partial until BCP formalised. |
| 17 | Archiving — data readable & integrity-preserved over archival period; checked on system changes | 🟡 | Ties to G6. Control: SOP-003 archival checks; migration contingency. |

## 3. Annex 11 "Beyond Part 11" Gap Summary

| # | Annex 11 § | Beyond-P11 expectation | Status | Control |
|---|---|---|---|---|
| A1 | §3.2 | Formal supplier agreement | ❌ | Documented OSS decision; procure Enterprise if support needed |
| A2 | §9 | **Audit-trail review** duty | 🟡→✅ | SOP-003 mandates periodic audit-trail review |
| A3 | §11 | Periodic re-evaluation | ✅ | SOP-003 |
| A4 | §13 | Incident management | ✅ | SOP-005 |
| A5 | §16 | Business continuity plan | 🟡 | BCP to be formalised (backup + fork/Enterprise contingency + paper fallback) |
| A6 | §1 | Lifecycle risk management | ✅ | VQ-005 |
| A7 | §4.3 | Infrastructure qualification | 🟡 | Ensure infra qualification documented |

## 4. Conclusion
Against Annex 11, OpenClinica CE plus the SOP suite is **largely compliant**, and the package is actually *stronger* on Annex 11's lifecycle expectations (risk management, periodic review, incident management) than a minimal Part-11-only effort would be. The two material Annex-11-specific weaknesses are **A1 (no supplier agreement — inherent to free CE)** and **A5 (BCP not yet formalised)**. Both are dispositioned procedurally with accepted, monitored residual risk. Where Annex 11 exceeds Part 11, those deltas are explicitly covered by **SOP-003 (periodic review + audit-trail review)** and **SOP-005 (incident management)**.
