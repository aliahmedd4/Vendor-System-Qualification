/**
 * Structured evidence recorder for the OQ harness.
 *
 * Each OQ test produces a JSON evidence artefact under evidence/records/<OQ-ID>.json
 * containing: the test identity, the URS/risk it traces to, the expected result, the
 * actual observation, the pass/fail verdict, and - crucially - the NATIVE DIGITAL
 * EVIDENCE attached (audit-trail rows, log lines, DB privilege listings). This is the
 * machine-readable equivalent of the "Actual Result / Evidence" columns in VQ-007,
 * and is what an inspector or reviewer reconciles against the paper protocol.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export interface EvidenceRecord {
  oqId: string;                 // e.g. "OQ-12"
  title: string;
  ursRefs: string[];            // e.g. ["URS-030","URS-031"]
  riskRefs: string[];           // e.g. ["R-03"]
  expected: string;
  actual?: string;
  verdict: 'PASS' | 'FAIL' | 'PENDING';
  capturedAt: string;           // ISO timestamp
  nativeEvidence: {             // native digital records, preferred over screenshots
    type: 'audit-trail' | 'login-audit' | 'db-privilege' | 'app-log' | 'ui-state' | 'export-file';
    description: string;
    data: unknown;
  }[];
  notes?: string;
}

const EVIDENCE_DIR = join(process.cwd(), 'evidence', 'records');

export class Evidence {
  private rec: EvidenceRecord;

  constructor(oqId: string, title: string, ursRefs: string[], riskRefs: string[], expected: string) {
    this.rec = {
      oqId, title, ursRefs, riskRefs, expected,
      verdict: 'PENDING',
      capturedAt: new Date().toISOString(),
      nativeEvidence: [],
    };
  }

  attach(type: EvidenceRecord['nativeEvidence'][number]['type'], description: string, data: unknown): this {
    this.rec.nativeEvidence.push({ type, description, data });
    return this;
  }

  pass(actual: string): this { this.rec.verdict = 'PASS'; this.rec.actual = actual; return this; }
  fail(actual: string): this { this.rec.verdict = 'FAIL'; this.rec.actual = actual; return this; }
  note(n: string): this { this.rec.notes = n; return this; }

  /** Persist the evidence artefact. Called in each test's finally/afterEach. */
  save(): EvidenceRecord {
    this.rec.capturedAt = new Date().toISOString();
    const path = join(EVIDENCE_DIR, `${this.rec.oqId}.json`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(this.rec, null, 2), 'utf-8');
    return this.rec;
  }

  get verdict() { return this.rec.verdict; }
}
