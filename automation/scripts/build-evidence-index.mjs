/**
 * Consolidates the per-test evidence artefacts (evidence/records/*.json) into a single
 * signed-off-able evidence index (evidence/OQ-evidence-index.json + .md), cross-linking
 * each OQ case to its URS/risk and verdict. Run after `npm run test:oq`.
 *
 *   node scripts/build-evidence-index.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const recordsDir = join(process.cwd(), 'evidence', 'records');
const outDir = join(process.cwd(), 'evidence');
if (!existsSync(recordsDir)) { console.error('No evidence/records found. Run the OQ suite first.'); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const records = readdirSync(recordsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(readFileSync(join(recordsDir, f), 'utf-8')))
  .sort((a, b) => a.oqId.localeCompare(b.oqId, undefined, { numeric: true }));

const summary = {
  generatedAt: new Date().toISOString(),
  total: records.length,
  pass: records.filter(r => r.verdict === 'PASS').length,
  fail: records.filter(r => r.verdict === 'FAIL').length,
  pending: records.filter(r => r.verdict === 'PENDING').length,
  records,
};
writeFileSync(join(outDir, 'OQ-evidence-index.json'), JSON.stringify(summary, null, 2));

const rows = records.map(r =>
  `| ${r.oqId} | ${r.title} | ${r.ursRefs.join(', ')} | ${r.riskRefs.join(', ')} | ${r.verdict} | ${r.nativeEvidence.length} artefact(s) |`
).join('\n');

const md = `# OQ Automated Evidence Index

Generated: ${summary.generatedAt}

**Result:** ${summary.pass} PASS · ${summary.fail} FAIL · ${summary.pending} PENDING (of ${summary.total})

| OQ ID | Title | URS | Risk | Verdict | Native evidence |
|---|---|---|---|---|---|
${rows}

> Native evidence artefacts (audit-trail rows, login-audit, DB privileges, export files)
> are embedded in \`evidence/records/<OQ-ID>.json\`. This index reconciles the automated
> run against VQ-007 (OQ) and VQ-009 (RTM).
`;
writeFileSync(join(outDir, 'OQ-evidence-index.md'), md);
console.log(`Evidence index written: ${summary.pass}/${summary.total} passed.`);
