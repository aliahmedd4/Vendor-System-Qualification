# VQ-002 — Supplier Assessment

| Field | Value |
|---|---|
| Document ID | VQ-002 |
| Title | Supplier Assessment — OpenClinica LLC / OpenClinica Community Edition |
| Version | 1.0 |
| Status | Approved |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |
| Assessment method | Remote / desk-based (documentation, public repositories, release records) |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

---

## 1. Purpose & Method

To assess OpenClinica LLC and the Community Edition (CE) product against supplier-quality criteria, so the Validation Plan (VQ-001 §6) can decide how much of the sponsor's testing burden the supplier's own work can offset.

**Method:** desk-based assessment (GAMP 5 "supplier assessment" tier appropriate for a Category 4 product of medium risk). Evidence sources: supplier website and Reference Guide, public source repositories (GitHub), published release notes, community forum activity, and licence text. **No on-site or postal audit was performed** — §9 concludes whether one would be warranted in a real engagement.

> **Regulatory reasoning.** GAMP 5 offers a spectrum of supplier assurance: from a light documentation review, through postal questionnaire, to a full on-site audit. You choose the depth by *risk × novelty × how much credit you want to take*. Because we intend to take only limited credit for CE (see conclusion) and the product is widely used, a desk assessment is defensible. If we wanted to waive OQ testing of, say, the audit trail, we would need audit-grade evidence — which we do not have, and therefore we do not waive it.

## 2. Supplier Profile

| Attribute | Finding |
|---|---|
| Legal entity | OpenClinica LLC, Waltham, Massachusetts, USA |
| History | Established EDC vendor; OpenClinica has been in use in academic and commercial trials since c. 2005; described as an early "commercial open-source" clinical trial platform |
| Business model | **Dual model** — commercial **Enterprise/OC4** (paid, supported, hosted) and free **Community Edition** (LGPL, self-hosted) |
| Edition assessed | Community Edition (3.x line) |
| Licence | GNU LGPL — verified genuinely free for self-hosted use |

## 3. Development & Quality Practices

| Criterion | Finding | Rating |
|---|---|---|
| Formal SDLC | Enterprise product is developed under a commercial process; **the free CE does not publish a QMS-grade SDLC** for the community line | Amber |
| Source control | Public version control (GitHub) with visible commit history | Green |
| Coding standards / review | Visible in repo history but not formally attested for CE | Amber |
| Testing evidence | Vendor does **not** publish test protocols/results for CE that a sponsor could rely on as audit-grade evidence | **Red** |
| Traceability (vendor internal) | Not published for CE | Amber |

**Interpretation.** The commercial entity clearly has engineering maturity, but the *free edition* does not come with the documented, attestable quality record that would let a sponsor bank large amounts of test credit. This is typical of open-source-community editions and is the single most important finding.

## 4. Release History & Maintenance

| Criterion | Finding | Rating |
|---|---|---|
| Release cadence (CE) | CE (3.x) receives **infrequent** updates; the vendor's active investment is in Enterprise/OC4 | Amber/Red |
| Technology currency | CE targets an **older runtime stack** (Tomcat 7-era, Java 7, PostgreSQL 9.x). These platform versions are themselves end-of-life, raising a **security-patch and obsolescence risk** | **Red** |
| Upgrade path | Migrating CE→OC4 is a product change, not a patch; no seamless in-place modernisation of the free line | Amber |
| Versioned release notes | Available for historical releases | Green |

> **Why this is a finding, not a dealbreaker.** Older-but-stable software can be validated; regulators care about *fitness for intended use under control*, not novelty. But end-of-life runtime components mean OS/DB/Java security fixes may not arrive. That risk is carried forward to VQ-005 (Risk Assessment) and mitigated procedurally — network isolation, restricted access, and a documented decision to run a frozen, controlled configuration (SOP-004 Change Control, SOP-005 Incident Management).

## 5. Defect Reporting & Transparency

| Criterion | Finding | Rating |
|---|---|---|
| Public issue tracker | Yes — issues/bugs visible in public repositories | Green |
| Defect disclosure to users | Community-visible; **no contractual defect-notification obligation** for CE users | Amber |
| Security advisory process | No formal CVE/advisory pipeline dedicated to the free CE | Amber/Red |
| User workaround/knowledge base | Reference Guide + forum threads exist | Green |

## 6. Documentation Quality

| Criterion | Finding | Rating |
|---|---|---|
| Installation/admin docs | Reference Guide covers installation, configuration, system requirements — **usable for IQ** | Green |
| Functional/user docs | Adequate for data entry, CRF build, rules, discrepancy management | Green |
| Validation support docs | Some validation guidance historically offered (often oriented to Enterprise customers); **not a turnkey validation pack for CE** | Amber |
| Currency of docs | Docs mix versions; care needed to match the exact installed build | Amber |

## 7. Support & Community Health

| Criterion | Finding | Rating |
|---|---|---|
| Commercial support (CE) | **None guaranteed** — paid support is an Enterprise offering; CE relies on community | **Red** for CE |
| Community forum | Active historically; volume has declined as focus shifted to Enterprise | Amber |
| Third-party ecosystem | Multiple community Docker images and a maintained fork (**LibreClinica**) exist — evidence of continued community interest and a viable contingency | Green |
| Key-person / bus-factor risk | Community line depends on a small pool of maintainers | Amber |

> **Contingency note.** The existence of the LibreClinica fork is a genuine risk-reducer: if CE were fully abandoned, an actively-maintained, feature-compatible successor exists. This is recorded as a business-continuity mitigation.

## 8. Risk Rating

Scoring each dimension (Green=1, Amber=2, Red=3), weighted toward practices that bear on data integrity:

| Dimension | Rating | Weight | Score |
|---|---|---|---|
| Development & quality practices | Amber/Red | ×3 | 8 |
| Release history & tech currency | Red | ×3 | 9 |
| Defect reporting | Amber | ×2 | 4 |
| Documentation | Green/Amber | ×2 | 3 |
| Support & community | Red (CE) | ×2 | 6 |
| **Total** | | | **30 / 51** |

**Overall supplier risk rating: MEDIUM–HIGH.**

The commercial vendor is credible; the **free edition specifically** carries elevated risk from (a) absent audit-grade quality evidence, (b) end-of-life technology stack, and (c) no guaranteed support for CE.

## 9. Would a Supplier Audit Be Warranted?

**In this portfolio context:** No — desk assessment is proportionate, and we compensate by testing high-risk functions ourselves.

**In a real regulated engagement:** **Partially, and conditionally.**
- A traditional **on-site QMS audit of "the vendor" adds limited value for the free CE**, because the community line is not developed under a sponsor-auditable commercial QMS — there may be little to audit against.
- Therefore the *proportionate* real-world action is **not** a classic supplier audit but: (i) if the organisation needs vendor assurance and support, **procure OpenClinica Enterprise/OC4 and audit that** commercial offering, or (ii) if committed to CE, treat it as **effectively unsupported open-source software** and place the assurance burden on the sponsor's own qualification, security hardening, and change/incident SOPs. 
- A **focused technical/security review** (dependency and CVE review of the runtime stack, penetration test of the deployment) would be more valuable than a paperwork audit.

## 10. Conclusion — Impact on Validation Effort

| Decision | Outcome |
|---|---|
| Take broad credit for vendor testing? | **No** |
| High-risk functions (audit trail, e-signature, RBAC, data integrity) | **Fully scripted OQ testing by sponsor** — no vendor credit taken |
| Low-risk, ubiquitous standard behaviours (e.g. basic navigation, list rendering) | Lighter verification acceptable |
| Technology-currency & support risks | Carried to VQ-005; mitigated by isolation + SOP-004/005; LibreClinica noted as contingency |
| Supplier audit | Not performed; rationale documented (§9) |

This medium–high rating is **exactly why** the OQ (VQ-007) is comprehensive rather than a light touch: the burden the supplier cannot carry falls to the sponsor's own testing.

## 11. References
ISPE GAMP 5 (2nd ed.) — Supplier Assessment appendices · OpenClinica LLC public documentation & repositories · LibreClinica project (community fork) · VQ-001, VQ-005.
