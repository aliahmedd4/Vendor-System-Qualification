# VQ-001 — Validation Plan

| Field | Value |
|---|---|
| Document ID | VQ-001 |
| Title | Validation Plan — Vendor Qualification of OpenClinica Community Edition |
| Version | 1.0 |
| Status | Approved for Execution |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |
| System | OpenClinica Community Edition (3.x line) |
| Project | Vendor Qualification (VQ) of OpenClinica CE as EDC for Study NWT-ORX201-201 |
| Supersedes | None |

### Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / System Owner (Clinical Data Mgmt) | ________________ | ________________ | __________ |
| Reviewer / IT & Security | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |

> **Signature meaning.** Author = content is complete and correct. Reviewer = content is technically accurate and adequate. Approver (QA) = the document meets GxP requirements and the approach is acceptable. No execution activity begins until all approvals are in place. This is the "approved before use" principle behind 21 CFR Part 11 §11.10(a) and EU Annex 11 §4.

---

## 1. Purpose

This plan defines the approach, scope, responsibilities, and deliverables for qualifying **OpenClinica Community Edition (CE)** as the Electronic Data Capture (EDC) system supporting **Study NWT-ORX201-201**, a fictional Phase II clinical trial sponsored by Northwind Therapeutics, Inc.

The objective is documented evidence that the system, **as installed and configured** in Northwind's environment, is fit for its intended use and operates in compliance with 21 CFR Part 11 and EU Annex 11, to the extent supported by the software plus compensating procedural controls.

> **Regulatory reasoning — why a plan at all.** GxP validation is *planned, then executed, then reported*. The predicate rule (21 CFR 312 / ICH E6(R2) §5.5.3) requires that systems used in trials be validated. GAMP 5 (2nd ed.) operationalises this as a documented lifecycle. The Validation Plan is the contract: it fixes scope and acceptance criteria **before** testing, so results can't be reverse-engineered to a desired conclusion. Writing acceptance criteria after seeing results is the single most common data-integrity failure an inspector looks for.

## 2. System Overview

| Attribute | Value |
|---|---|
| Product | OpenClinica Community Edition |
| Supplier | OpenClinica LLC (Waltham, MA, USA) |
| Licence | GNU LGPL (Community Edition) |
| Architecture | Java web application (Apache Tomcat) + PostgreSQL RDBMS |
| Deployment | Self-hosted, containerised via Docker on Northwind infrastructure |
| Intended use | Capture, query, sign-off, and export of clinical trial data (CRFs) for one Phase II study |
| Users | ~12 (Data Entry, CRA/Monitor, Data Manager, Investigator, Administrator) |
| GxP impact | **GxP-critical** — holds source/CRF data supporting a regulatory submission |

**Business process supported:** subject enrolment → visit data entry → automated + manual edit checks → discrepancy/query management → investigator electronic sign-off → data extract for statistical analysis.

## 3. GAMP 5 Software Categorisation

**Determination: GAMP 5 Category 4 (Configured Product).**

| Category | Definition | Applies here? |
|---|---|---|
| 1 — Infrastructure | OS, DB engine, runtime | Underlying Tomcat/PostgreSQL/Docker are Cat 1 (qualified as infrastructure) |
| 3 — Non-configured | COTS used as shipped, default config only | **No** |
| 4 — Configured | COTS configured to business process without changing code | **Yes — primary categorisation** |
| 5 — Custom | Bespoke code / custom development | Only if custom extensions were written (none planned) |

**Justification.** OpenClinica CE is commercial-off-the-shelf software used by many organisations, but Northwind does not run it "out of the box." We define study-specific artefacts that materially change system behaviour: **CRF definitions, edit-check rules, user roles and the permission matrix, study event definitions, and security parameters** (password policy, session timeout). These are *configuration*, not code changes — the source is not modified. That is the textbook definition of Category 4.

> **Why the category matters — it sizes the testing.** GAMP 5 is risk- and supplier-based. For a Category 4 system you do **not** re-test the vendor's source code line by line; you (a) leverage the supplier's own development and testing for the standard product, and (b) focus *your* testing on the configuration you applied and the risks that configuration introduces. Mis-categorising as Category 5 would force custom-code-level testing you can't perform on someone else's codebase and would waste effort; mis-categorising as Category 3 would let genuine configuration risk go untested. Category 4 is both honest and efficient.
>
> **Note on categories not being rigid.** GAMP 5 (2nd ed.) explicitly says categories are a guide, not a straitjacket, and a system can contain components of several categories. Our edit checks, if implemented via OpenClinica's rule engine, remain configuration (Cat 4). Were we to write custom Java extensions, *those specific components* would become Cat 5 and attract additional design and unit-test evidence. None are planned; if added later, this plan is updated under change control (see SOP-004).

## 4. Validation Lifecycle Approach (V-Model)

We apply a specification-and-verification V-model scaled to a Category 4 system:

```
 User Requirements (VQ-003 URS) ───────────────► Performance Qualification (VQ-008 PQ)
        │                                                     ▲
        ▼                                                     │
 Functional/Config Spec (VQ-004) ──────────────► Operational Qualification (VQ-007 OQ)
        │                                                     ▲
        ▼                                                     │
 Installation design (Docker/env) ─────────────► Installation Qualification (VQ-006 IQ)
```

- **Left leg (specify):** URS → Configuration Specification → installation design.
- **Right leg (verify):** IQ confirms it is installed correctly; OQ confirms functions work as specified and configured; PQ confirms it supports the real business process end-to-end.
- **Traceability** (VQ-009 RTM) ties every requirement to a configuration item, a test case, and a result. Untraced requirements and orphan tests are both defects in the package.

Risk assessment (VQ-005) runs across the whole lifecycle and **determines test depth** per function (see §6).

## 5. Scope

**In scope:** authentication & access control; role-based permission enforcement; audit trail; electronic signatures; edit checks; discrepancy/query workflow; record status/locking; session timeout; account lockout; backup and restore; data extract integrity; the specific study configuration for NWT-ORX201-201.

**Out of scope:** validation of the underlying OS/Docker host (covered by infrastructure qualification, referenced not repeated); network firewall build (IT responsibility, referenced in IQ); statistical analysis software downstream of the extract; OpenClinica Enterprise/OC4 features not present in CE.

**Assumptions & constraints:**
- CE is the **3.x** product line; its supported runtime stack (Tomcat 7-era, Java 7, PostgreSQL 9.x) is older than current platforms. Technology-currency risk is assessed in VQ-002 and VQ-005 and mitigated procedurally.
- No production patient data is used; PQ uses fabricated subjects.
- This is a single-study qualification; multi-study/production rollout would require re-scoping.

## 6. How Supplier Assessment Reduces the Testing Burden

This is the economic heart of GAMP 5 and deserves an explicit statement.

1. **Leverage, don't duplicate.** For a Category 4 product, the supplier is presumed to have designed, coded, and tested the standard functionality under their own quality system. If the **Supplier Assessment (VQ-002)** provides adequate confidence in those practices, the sponsor may *rely on* that work and is **not** obliged to re-verify baseline product behaviour from scratch.
2. **Assessment outcome scales rigour.** A strong supplier result → lighter, risk-targeted verification of standard functions and heavier focus on configuration. A weak supplier result → more sponsor testing to compensate, and possibly a supplier audit.
3. **Risk still overrides.** Even with a strong supplier, functions with high patient-safety / data-integrity impact (audit trail, e-signature, access control) get **scripted OQ testing regardless**, because the consequence of failure is severe (VQ-005 drives this).
4. **Honest limitation for OpenClinica CE.** CE is open-source with a **community**-driven quality process rather than a fully documented commercial QMS for the free edition. VQ-002 concludes a **Medium supplier risk**. Consequence for this plan: we **do not** take broad credit for vendor testing of high-risk functions; those are scripted in OQ. We take limited credit only for low-risk, widely-exercised standard behaviours, which receive lighter verification. This is the correct, conservative reading of "supplier assessment reduces burden" — it reduces it *selectively*, justified by risk.

> **Plain-English version.** Supplier assessment is how you avoid re-testing the whole product. But you only get to skip what the vendor demonstrably does well *and* what wouldn't hurt a patient if it broke. For OpenClinica CE we can't fully verify the vendor's QMS, so we bank very little credit and test the dangerous stuff ourselves.

## 7. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Validation Lead | Owns this plan, protocols, RTM, summary report; ensures execution discipline |
| System Owner (Clinical Data Management) | Defines URS, owns configuration decisions, approves PQ |
| IT / Infrastructure | Performs IQ, backup/restore, security config |
| Quality Assurance | Approves all documents, reviews deviations, authorises release |
| Tester(s) | Execute OQ/PQ, capture evidence, record results contemporaneously |

## 8. Deliverables

VQ-001 Validation Plan · VQ-002 Supplier Assessment · VQ-003 URS · VQ-004 Configuration Specification · VQ-005 Risk Assessment (FMEA) · VQ-006 IQ · VQ-007 OQ · VQ-008 PQ · VQ-009 RTM · VQ-010 Part 11 Gap Assessment · VQ-011 Annex 11 Assessment · VQ-012 Deviation Log · VQ-013 Validation Summary Report · SOP-001…005.

## 9. Acceptance Criteria for the Validation

The system is considered validated and releasable when:
- All IQ/OQ/PQ test cases are executed and **pass**, or failures are dispositioned via VQ-012 with QA-approved justification/CAPA;
- The RTM (VQ-009) shows every in-scope URS requirement traced to a passed test;
- All identified critical/major risks (VQ-005) have effective mitigations verified;
- Part 11 / Annex 11 gaps (VQ-010/011) each have an implemented compensating control or an accepted, documented residual risk;
- The Validation Summary Report (VQ-013) is approved by QA.

## 10. Deviation & Change Handling

Deviations found during execution are logged in **VQ-012** and dispositioned before release. Changes to the validated state after release follow **SOP-004 Change Control**. This plan itself is under change control; material scope changes require re-approval by the signatories in the block above.

## 11. References

- 21 CFR Part 11 — Electronic Records; Electronic Signatures
- EU Annex 11 — Computerised Systems
- ICH E6(R2) Good Clinical Practice §5.5.3
- ISPE GAMP 5: A Risk-Based Approach to Compliant GxP Computerized Systems (2nd ed., 2022)
- FDA Guidance — Computer Software Assurance for Production and Quality System Software (2022)
- OpenClinica Reference Guide & System Requirements (supplier documentation)
