# VQ-006 — Installation Qualification (IQ) Protocol

| Field | Value |
|---|---|
| Document ID | VQ-006 |
| Title | Installation Qualification Protocol — OpenClinica CE |
| Version | 1.0 |
| Status | Approved for Execution |
| Effective Date | 2026-07-25 |
| Author | A. Hassan — Validation Lead |

### Approval (pre-execution) & Execution Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Author / Validation Lead | A. Hassan | ________________ | __________ |
| Reviewer / IT & Infrastructure | ________________ | ________________ | __________ |
| Approver / Quality Assurance | ________________ | ________________ | __________ |
| **Executed by (tester)** | ________________ | ________________ | __________ |
| **Execution reviewed by (QA)** | ________________ | ________________ | __________ |

---

## 1. Purpose

To verify and document that OpenClinica CE and its supporting components are **installed correctly, completely, and reproducibly** in Northwind's environment, and that the installed versions match the intended, controlled baseline.

> **Regulatory reasoning.** IQ answers: "Is it built the way we said, from known-good parts, and can we prove it?" It is the foundation the OQ/PQ stand on — if you can't say *exactly* what version and configuration you tested, your OQ evidence is unanchored. Recording **image digests** (not just tags) matters because a tag like `:latest` is mutable — the same tag can point to different bytes tomorrow. A SHA-256 digest is immutable and is the digital equivalent of a certified component lot number. This directly supports Part 11's requirement for trustworthy records and Annex 11 §4.5 (documented, controlled installation).

## 2. Pre-requisites
- Environment/host provisioned and hardened per IT baseline (referenced, not re-qualified here).
- Docker Engine installed; version recorded (§4).
- This protocol approved (signatures above) **before** any step is executed.
- Blank evidence appendix ready; all results recorded **contemporaneously** in ink/electronically with executor initials + date.

## 3. Execution Rules
- Record **actual** results next to **expected**; mark **Pass/Fail**.
- Any discrepancy → log in **VQ-012 Deviation Log**, cross-reference the step ID, continue only if safe.
- Attach command output as evidence. **Prefer captured console/log output over screenshots** (native digital record, per FDA CSA).
- No step may be back-dated or overwritten; corrections are single-line-through + initial + date.

## 4. IQ Test Steps

### 4.1 Host & Runtime
| Step | Instruction | Expected | Evidence to capture | Actual | P/F |
|---|---|---|---|---|---|
| IQ-01 | Record host OS and kernel | Documented, matches approved baseline | `uname -a` / `systeminfo` output | | |
| IQ-02 | Record Docker Engine version | Recorded; supported | `docker --version`, `docker info` | | |
| IQ-03 | Confirm NTP/time sync active; TZ=UTC | Clock synced; UTC | `timedatectl` output | | |

### 4.2 Container Images & Digests (the heart of IQ)
| Step | Instruction | Expected | Evidence | Actual | P/F |
|---|---|---|---|---|---|
| IQ-04 | Pull/identify OpenClinica CE image; record **tag AND digest** | Digest recorded | `docker images --digests` line for the OC image → paste `sha256:____` | | |
| IQ-05 | Record PostgreSQL image tag + digest | Digest recorded; version = intended (e.g. PostgreSQL 9.x per CE support) | `docker images --digests` for postgres | | |
| IQ-06 | Record any reverse-proxy/TLS image tag + digest | Digest recorded | `docker images --digests` | | |
| IQ-07 | Capture `docker compose config` (rendered) | Matches approved compose file; no unexpected services | Rendered compose YAML | | |

> Record digests here at execution:
> - OpenClinica CE: `______________________________________  sha256:__________`
> - PostgreSQL: `__________________________________________  sha256:__________`
> - Reverse proxy (if used): `______________________________  sha256:__________`

### 4.3 Application Version
| Step | Instruction | Expected | Evidence | Actual | P/F |
|---|---|---|---|---|---|
| IQ-08 | Start stack; confirm OpenClinica version in UI/About and build info | Version matches baseline recorded in VQ-001/VQ-004 | About-page text / version string from logs | | |
| IQ-09 | Confirm Tomcat and Java versions inside container | Versions match CE support matrix; recorded | `java -version`, Tomcat version output | | |

### 4.4 Database
| Step | Instruction | Expected | Evidence | Actual | P/F |
|---|---|---|---|---|---|
| IQ-10 | Confirm PostgreSQL server version and that OC schema is created | Version recorded; schema/tables present | `SELECT version();` + table list | | |
| IQ-11 | Verify DB credentials are non-default and access is restricted to app + admins | No default/blank passwords; restricted `pg_hba`/network | Redacted config evidence | | |
| IQ-12 | Verify audit-trail tables exist and are populated on a test change | Audit tables present; a test edit creates an audit row with old/new/user/time | `SELECT` from audit table showing the row | | |
| IQ-13 | Verify audit-immutability triggers are installed (post-schema-setup.sql) and reject UPDATE/DELETE on audit tables | Direct UPDATE/DELETE on audit_log_event / audit_user_login is rejected by trigger | Trigger listing (`\d audit_log_event`) + rejection message from a rolled-back test write | | |

### 4.5 Network & Security Configuration
| Step | Instruction | Expected | Evidence | Actual | P/F |
|---|---|---|---|---|---|
| IQ-14 | Confirm HTTPS/TLS reachable; plain HTTP disabled/redirected externally | TLS works; HTTP not externally usable | `curl -vkI https://...` + HTTP attempt result | | |
| IQ-15 | Confirm the app is bound to internal network only (no public exposure) | Not reachable from public interface | Port/binding listing | | |
| IQ-16 | Confirm session-timeout setting present (Tomcat `web.xml`/app config = 15 min) | `<session-timeout>15</session-timeout>` or app equivalent | Config excerpt | | |
| IQ-17 | Confirm password-policy settings applied (length/complexity/expiry/lockout) per CFG-060…064 | Values match VQ-004 | Config/DB settings evidence | | |

### 4.6 Persistence, Backup Hooks & Logs
| Step | Instruction | Expected | Evidence | Actual | P/F |
|---|---|---|---|---|---|
| IQ-18 | Confirm data volumes are persistent (survive container restart) | Data persists after `docker restart` | Before/after data check | | |
| IQ-19 | Confirm backup mechanism (DB dump) is configured & writable to secure location | `pg_dump` succeeds to target | Backup file listing + size | | |
| IQ-20 | Confirm application & container logs are being written and retained | Logs present, timestamped | Log tail excerpt | | |

## 5. Installation Verification Summary
| Item | Result |
|---|---|
| All IQ steps executed | ☐ |
| All digests/versions recorded | ☐ |
| Deviations logged (VQ-012) & dispositioned | ☐ |
| System ready for OQ | ☐ |

## 6. Evidence of Successful Install (attach at execution)
- Rendered `docker compose config`
- `docker images --digests` full listing
- DB version + audit-table proof (IQ-12)
- TLS verification output (IQ-14)
- Signed/dated evidence appendix

## 7. Reproducibility Statement
Because the exact **image digests**, compose file, and configuration values are recorded, this installation is **reproducible**: re-pulling by digest and applying the same compose + config yields a byte-identical application layer. This satisfies the "documented and reproducible installation" expectation and enables disaster recovery per SOP-002.
