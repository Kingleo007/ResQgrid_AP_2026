#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '../..');
const require = createRequire(path.join(project, 'backend/package.json'));
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(project, 'backend/.env') });

const runCount = Number(process.argv[2] ?? 3);
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Set DATABASE_URL or add it to backend/.env');
if (!Number.isInteger(runCount) || runCount < 1) throw new Error('Run count must be a positive integer');

const source = fs.readFileSync(path.join(project, 'dbms/04_queries.sql'), 'utf8');
const queries = [];
const lines = source.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const marker = lines[i].match(/^--\s+(R\d+[a-z]?|W\d+)\s+—\s+(READ|WRITE)\b/);
  if (!marker) continue;
  const id = marker[1];
  const type = marker[2];
  const sqlLines = [];
  for (i++; i < lines.length; i++) {
    if (/^--\s+(?:R\d+[a-z]?|W\d+)\s+—\s+(?:READ|WRITE)\b/.test(lines[i])) { i--; break; }
    const line = lines[i].replace(/--.*$/, '').trim();
    if (!line) continue;
    const end = line.indexOf(';');
    sqlLines.push(end >= 0 ? line.slice(0, end) : line);
    if (end >= 0) break;
  }
  const sql = sqlLines.join('\n').trim();
  if (!sql) throw new Error(`No SQL found for ${id}`);
  queries.push({ id, type, sql });
}
if (queries.length !== 16) throw new Error(`Expected 16 queries in dbms/04_queries.sql; found ${queries.length}`);

const client = new Client({ connectionString });
const outputDir = path.join(project, 'dbms/benchmarks/results');
const round = (n) => Number(n.toFixed(3));
const escapeCell = (value) => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>');

try {
  await client.connect();
  const userResult = await client.query('SELECT id, email FROM users ORDER BY email LIMIT 1');
  const incidentResult = await client.query('SELECT id FROM incidents ORDER BY created_at LIMIT 1');
  const userId = userResult.rows[0]?.id ?? null;
  const email = userResult.rows[0]?.email ?? 'benchmark@resqgrid.local';
  const incidentId = incidentResult.rows[0]?.id ?? null;
  const argsFor = {
    R1: [email],
    R3: [incidentId],
    W1: [`BENCH-${Date.now()}`, 'Benchmark incident', 'other', 'low', 'Benchmark rollback row', 'Benchmark location', userId],
    W2: [incidentId, null, null, null, null, null, null],
    W3: [incidentId],
    W4: [`benchmark-${Date.now()}@resqgrid.local`, 'Benchmark User', 'not-a-real-password-hash'],
  };
  if (queries.some((q) => ['R3', 'W2', 'W3'].includes(q.id)) && !incidentId) {
    throw new Error('Seed at least one incident before benchmarking R3, W2, and W3.');
  }
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [index, query] of queries.entries()) {
    const reportId = `R${String(index + 1).padStart(2, '0')}`;
    const times = [];
    for (let run = 0; run < runCount; run++) {
      if (query.type === 'WRITE') await client.query('BEGIN');
      try {
        const result = await client.query(
          `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query.sql}`,
          argsFor[query.id] ?? [],
        );
        const plan = result.rows[0]['QUERY PLAN'][0];
        times.push(round(plan['Execution Time']));
      } finally {
        if (query.type === 'WRITE') await client.query('ROLLBACK');
      }
    }
    const avg = round(times.reduce((sum, value) => sum + value, 0) / times.length);
    const originalSql = query.sql.replace(/\s+/g, ' ').trim();
    const header = ['SQL Query', 'Type', ...times.map((_, i) => `Run ${i + 1} (ms)`), 'Average (ms)'];
    const row = [originalSql, query.type, ...times.map((t) => t.toFixed(3)), avg.toFixed(3)];
    const report = [
      `# ${reportId} — ${query.id}`,
      '',
      `| ${header.join(' | ')} |`,
      `| ${header.map(() => '---').join(' | ')} |`,
      `| ${row.map(escapeCell).join(' | ')} |`,
      '',
      `Source query: ${query.id} in dbms/04_queries.sql.`,
      `Measured with PostgreSQL EXPLAIN (ANALYZE, BUFFERS); ${runCount} run(s).`,
      query.type === 'WRITE' ? 'Each write run was rolled back.' : '',
      '',
      '```sql', query.sql, '```', '',
    ].filter((line) => line !== null).join('\n');
    fs.writeFileSync(path.join(outputDir, `${reportId}.txt`), report);
    console.log(`${reportId} (${query.id}) ${query.type}: ${avg.toFixed(3)} ms average`);
  }
  console.log(`Saved ${queries.length} reports to ${outputDir}`);
} finally {
  await client.end();
}
