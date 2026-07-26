# Vendor Qualification Package — OpenClinica Community Edition

A worked, portfolio-grade **Computer System Validation (CSV)** package qualifying a self-hosted, open-source **Electronic Data Capture (EDC)** system — OpenClinica Community Edition — for use in a fictional Phase II clinical trial (Sponsor: *Northwind Therapeutics*; Protocol: *NWT-ORX201-201*).

> Built as a learning artefact for a CS student studying GxP validation. Every document explains the **regulatory reasoning**, not just the "what".

---

## 1. What is vendor qualification, and why does it differ from validating custom software?

**Validation** is documented evidence that a computerised system is fit for its intended use and produces trustworthy records. **Vendor qualification** is validation applied to a system you *bought/adopted* rather than *built*. The difference is where the risk lives and, therefore, where you spend effort.

| | Custom software (GAMP 5 Category 5) | Vendor/COTS system (Category 3–4) |
|---|---|---|
| Who wrote the code? | You | A third-party supplier |
| Can you test the source directly? | Yes — unit tests, code review, design specs | No — it's someone else's codebase |
| Where does assurance come from? | Your own SDLC + design/unit/integration testing | **Supplier assessment** (leverage their QMS) **+** your black-box testing of configuration and behaviour |
| Main risk | Bugs in code you own | Supplier quality you can't see + **your configuration** + fitness for *your* process |
| Key extra document | Design & unit-test specs | **Supplier Assessment (VQ-002)** — decides how much of the vendor's work you can rely on |

The core move (GAMP 5): **don't re-test what the supplier already reliably tests — but only skip it where a failure wouldn't hurt a patient or corrupt data.** You assess the supplier, then concentrate *your* testing on (a) the configuration you applied and (b) high-risk functions, regardless of supplier strength. That's exactly how this package is structured: a medium–high supplier rating (VQ-002) → limited vendor credit → a comprehensive, risk-driven OQ (VQ-007).

Two other differences worth internalising:
- **You can't fix the software.** When the system falls short of 21 CFR Part 11 / Annex 11, you can't patch someone else's product on a whim — so you close the gap with a **procedural control** (an SOP) and accept/monitor residual risk. That's why VQ-010/011 pair every gap with a compensating control, and why the SOP suite exists.
- **Supplier lifecycle is out of your hands.** Release cadence, end-of-life, and support are the vendor's decisions. For OpenClinica CE that surfaced a real, honest finding — an end-of-life runtime stack — carried through VQ-002 → VQ-005 → VQ-010/011 rather than hidden.

## 2. What's in the package

```
qualification/
├── README.md                     ← you are here
├── VQ-001-Validation-Plan.md               Scope, GAMP 5 Cat 4 justification, supplier-leverage logic
├── VQ-002-Supplier-Assessment.md           Vendor evaluation → Medium–High risk, audit decision
├── VQ-003-User-Requirements-Specification.md   39 atomic, testable requirements
├── VQ-004-Configuration-Specification.md    Roles, permission matrix, study setup, edit checks, security params
├── VQ-005-Risk-Assessment-FMEA.md           RPN scoring → which functions get scripted vs light testing
├── VQ-006-IQ-Protocol.md                    Install verification incl. image DIGESTS, DB, TLS, network
├── VQ-007-OQ-Protocol.md                    31 scripted test cases (auth, RBAC, audit trail, e-sig, ...)
├── VQ-008-PQ-Protocol.md                    Mock study: 10 subjects, queries, sign-off, extract, ALCOA+
├── VQ-009-Requirements-Traceability-Matrix.md  URS → config → test → result
├── VQ-010-21CFR-Part11-Gap-Assessment.md    Clause-by-clause; gaps + compensating controls (the key doc)
├── VQ-011-EU-Annex11-Assessment.md          Clause-by-clause; highlights where Annex 11 exceeds Part 11
├── VQ-012-Deviation-Log.md                  Issues (anticipated → confirmed at execution)
├── VQ-013-Validation-Summary-Report.md      Conclusion + release statement
├── SOPs/
│   ├── SOP-001-User-Access-Management.md
│   ├── SOP-002-Backup-and-Restore.md
│   ├── SOP-003-Periodic-Review.md
│   ├── SOP-004-Change-Control.md
│   └── SOP-005-Incident-Management.md
└── automation/                   ← STEP 3: Playwright OQ evidence harness
    ├── package.json, playwright.config.ts, tsconfig.json, .env.example
    ├── src/       oc-app.ts (page object) · audit-db.ts (read-only native evidence)
    │              admin-db.ts (privileged fixture + OQ-15 tamper test) · evidence.ts
    ├── tests/     oq.spec.ts (executes OQ cases, exports structured evidence)
    ├── scripts/   build-evidence-index.mjs
    └── docker/    docker-compose.yml · init-readonly.sql (role @ initdb)
                   post-schema-setup.sql (grants + immutability triggers, post-boot)
                   nginx-tls.conf · generate-certs.sh / .ps1 (TLS proxy)
```

**Read them in numeric order.** The V-model flows: URS (003) → Config (004) specify; IQ (006) → OQ (007) → PQ (008) verify; risk (005) sets test depth; the RTM (009) proves coverage; 010/011 assess compliance; 012/013 close it out.

## 3. The automated evidence approach (FDA Computer Software Assurance)

STEP 3 deliberately favours **native digital records over screenshots**, per FDA's 2022 *Computer Software Assurance* guidance. The most important OQ evidence — that the audit trail records **old value, new value, user, timestamp, and reason for change** — is proven by querying OpenClinica's own `audit_log_event` table (`src/audit-db.ts`), not by photographing a screen. Login/lockout evidence comes from `audit_user_login`. Audit-trail immutability (OQ-15) is proven *functionally*: a write-capable connection attempts to `UPDATE` and `DELETE` an audit row and the test confirms the database **rejects** both (enforced by triggers in `post-schema-setup.sql`) — the attempt is always rolled back. This is deliberately not a "granted privileges" check, which could pass vacuously or miss owner privileges. Each test emits a structured JSON evidence artefact traced to its URS and risk IDs.

**Honesty about the harness:** cases that can be proven through native records (auth, audit-trail completeness, immutability, lockout, RBAC-by-route) are implemented concretely. Cases whose UI flow can't be confirmed without the running instance are marked `test.fixme` with the exact step and the evidence hook already wired — they are **not** faked to pass. Un-fix them once selectors are confirmed during execution (that confirmation is itself an execution activity, recorded in VQ-012 if anything differs from spec).

## 4. How to reproduce

> **Two `.env` files, by design.** `docker/.env` (copied from `docker/.env.example`) holds
> `DB_APP_PASSWORD` for `docker compose`; `automation/.env` (from `automation/.env.example`)
> configures the harness. Couplings: `DB_APP_PASSWORD` **=** `PGADMIN_PASSWORD`, and
> `PGPASSWORD` **=** the `oc_readonly` password in `docker/init-readonly.sql`.

### 4.1 Stand up the system (IQ)
```bash
cd qualification/automation/docker
# 1) Compose env (DB_APP_PASSWORD) + TLS cert for the proxy:
cp .env.example .env              # set DB_APP_PASSWORD (Windows: copy .env.example .env)
bash generate-certs.sh            # or: pwsh ./generate-certs.ps1  (writes ./certs)
# 2) Pin images by digest and record them in VQ-006 IQ-04/05 (do NOT keep :tags):
docker compose pull
docker images --digests           # copy the sha256 digests into VQ-006
# 3) Start; the app waits for the DB healthcheck before booting:
docker compose up -d
# 4) After OpenClinica has created its schema on first boot, apply table grants +
#    audit-immutability triggers (safe to re-run):
docker compose exec -T db psql -U openclinica -d openclinica -f - < post-schema-setup.sql
```
Then execute **VQ-006 IQ** step-by-step, recording versions, digests, DB/audit checks, TLS (IQ-14) and network binding. Capture console output as evidence (not screenshots).

### 4.2 Configure the study (per VQ-004)
Create the study `NWT-ORX201-201`, the five roles + test users (`admin1/dm1/cra1/de1/inv1`), CRFs, edit-check rules, and security parameters (password policy, 15-min session timeout, lockout at 5). Every value is specified in **VQ-004**.

### 4.3 Run the automated OQ evidence harness (STEP 3)
```bash
cd qualification/automation
npm install
npx playwright install --with-deps chromium
cp .env.example .env               # fill in URLs, test users, read-only DB creds
npm run test:oq                    # executes OQ cases, writes evidence/
npm run evidence:index             # consolidates -> evidence/OQ-evidence-index.md
```
Outputs:
- `evidence/junit/oq-results.xml` — machine-readable pass/fail for the validation file
- `evidence/json/oq-results.json` + `evidence/records/OQ-*.json` — structured evidence with embedded native audit-trail rows
- `evidence/OQ-evidence-index.md` — human-readable reconciliation against VQ-007 / VQ-009

### 4.4 Execute PQ and close out
Run the **VQ-008** mock study (enrol 10, enter data, raise/resolve queries, sign off, extract, reconcile ALCOA+). Log any real issues in **VQ-012**, complete the **VQ-009** result column, then finalise and sign **VQ-013**.

## 5. Honest status of this package

This is a **template + partially-automated execution framework**, not a record of a completed, signed validation. Specifically:
- All **13 VQ documents + 5 SOPs** are complete and internally consistent.
- Signature/approval blocks are **unsigned** (to be signed by real reviewers).
- **VQ-012** is pre-seeded with *anticipated* deviations (predictable from CE's documented characteristics) and clearly marked — they are confirmed or refuted during live execution.
- The **Playwright harness** runs; concrete tests assert real behaviour once pointed at a running instance, and scaffolded tests are honestly marked `fixme` rather than faked.
- **Image digests, exact versions, and execution results** are placeholders to be filled at execution — because inventing them would defeat the entire point of an IQ.

That honesty *is* the lesson: a good qualification package is auditable, traces every claim to evidence, and never asserts a pass it didn't observe.

## 6. Key references
21 CFR Part 11 · EU Annex 11 · ICH E6(R2) GCP §5.5.3 · ISPE GAMP 5 (2nd ed., 2022) · FDA *Computer Software Assurance for Production and Quality System Software* (2022) · OpenClinica Reference Guide.

## 7. Licence & data note
OpenClinica CE is licensed under the **GNU LGPL** (verified free for self-hosted use). No real patient data is used anywhere in this package — all subjects are fabricated.
