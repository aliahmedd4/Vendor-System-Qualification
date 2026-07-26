# SOP-001 — User Access Management

| Field | Value |
|---|---|
| Document ID | SOP-001 |
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
Govern the request, identity verification, granting, modification, periodic review, and removal of user access to OpenClinica CE, so access is limited to authorised, trained individuals and every account is attributable to one person. Supports 21 CFR Part 11 §11.10(d)(g)(i), §11.100(a)(b), §11.300(c); Annex 11 §2, §12.

## 2. Scope
All user accounts and roles (Administrator, Data Manager, CRA/Monitor, Data Entry, Investigator) on the qualified system.

## 3. Responsibilities
- **Line manager / Study lead:** raises access request, states required role.
- **QA/System Owner:** approves access and role appropriateness (segregation of duties).
- **Administrator:** creates/modifies/deactivates accounts; keeps evidence.

## 4. Procedure

### 4.1 Identity verification (Part 11 §11.100(b))
Before an account is created, the Administrator verifies the individual's identity against an authoritative record (HR record / government ID as per org policy) and records that verification occurred, by whom, and date.

### 4.2 Access request & approval
1. Requestor completes an Access Request (name, role, study/site, justification).
2. QA/System Owner approves the role against the **VQ-004 permission matrix** (confirm SoD — e.g. a signer is not also an administrator).
3. Confirm training is complete (§4.3) before enabling access.

### 4.3 Training prerequisite (§11.10(i))
No access is granted until the user has completed and signed for: (a) system-use training for their role, (b) the **e-signature accountability agreement** (that their e-signature is the legal equivalent of a handwritten signature, §11.100(c) org certification). Training records are retained.

### 4.4 Account creation
- Create a **unique** account (no shared/generic accounts). Usernames are never reused or reassigned.
- Assign the minimum role required (least privilege).
- Enforce password policy per CFG-060-064 (length ≥8, complexity, 90-day expiry, lockout at 5 attempts).

### 4.5 Modification & role change
Role changes follow the same request/approval path; the change is logged. Re-verify SoD after any change.

### 4.6 Credential loss / compromise (§11.300(c))
On report of a lost/compromised credential, Administrator immediately disables the account or forces a reset, records the event, and raises an incident per **SOP-005**.

### 4.7 Deactivation
On staff departure/role end, access is **deactivated (not deleted)** within one business day. Accounts are disabled to preserve audit-trail attribution of past actions.

### 4.8 Periodic access review
Quarterly, the System Owner reviews the active user list against current staffing and roles; discrepancies are corrected and recorded. (Feeds **SOP-003**.)

## 5. Records
Access requests & approvals; identity-verification records; training records & e-sig agreements; user list snapshots; quarterly review records; deactivation records. Retained per retention policy.

## 6. References
VQ-004 permission matrix; SOP-003; SOP-005; 21 CFR Part 11; Annex 11 §12.
