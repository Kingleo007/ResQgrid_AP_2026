#!/usr/bin/env python3
"""
run_benchmark.py — Benchmarks all 13 SQL queries in dbms/04_queries.sql on PostgreSQL.

What it does:
  1. Connects to the local `resqgrid` PostgreSQL database via `psql`.
  2. Picks one real incident ID (`INC-2026-0250`) to substitute into parameterized queries (R3, W2, W3).
  3. Runs each of the 13 queries (R1..R7, W1..W4) 3 times with `EXPLAIN (ANALYZE, BUFFERS)`.
  4. Wraps every WRITE query (W1..W4) in `BEGIN; ... ROLLBACK;` so the database data is unchanged.
  5. Saves all 3 raw execution plans per query into `dbms/plans/<QUERY_ID>.txt` and prints the
     3-run timings, average (ms), and scan type for `dbms/05_query_timings.md`.

Usage:
  python3 dbms/benchmarks/run_benchmark.py [database_name]
"""

import os
import re
import subprocess
import sys

DB = sys.argv[1] if len(sys.argv) > 1 else "resqgrid"
DBMS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANS_DIR = os.path.join(DBMS_DIR, "plans")
os.makedirs(PLANS_DIR, exist_ok=True)


def run_psql(sql: str) -> str:
    p = subprocess.run(
        ["psql", "-d", DB, "-X", "-q", "-A", "-t", "-v", "ON_ERROR_STOP=1"],
        input=sql,
        text=True,
        capture_output=True,
        check=True,
    )
    return p.stdout.strip()


def main() -> None:
    sample_inc_id = run_psql(
        "SELECT id FROM incidents WHERE incident_code = 'INC-2026-0250' LIMIT 1;"
    )
    if not sample_inc_id:
        sample_inc_id = run_psql("SELECT id FROM incidents LIMIT 1;")
    print(f"Database: {DB} | Sample incident ID: {sample_inc_id}\n")

    queries = [
        ("R1", "READ", "Login by email",
         "SELECT id, email, name, password_hash FROM users WHERE email = 'admin@resqgrid.local';"),
        ("R2", "READ", "List all incidents, newest first",
         "SELECT id, incident_code, title, hazard_type, severity, status, description, location_name, created_at, updated_at FROM incidents ORDER BY created_at DESC;"),
        ("R3", "READ", "Get one incident by ID",
         f"SELECT id, incident_code, title, hazard_type, severity, status, description, location_name, created_at, updated_at FROM incidents WHERE id = '{sample_inc_id}';"),
        ("R4a", "READ", "Dashboard: total incident count",
         "SELECT COUNT(*) AS total FROM incidents;"),
        ("R4b", "READ", "Dashboard: active incident count",
         "SELECT COUNT(*) AS active FROM incidents WHERE status NOT IN ('resolved', 'closed');"),
        ("R4c", "READ", "Dashboard: resolved incident count",
         "SELECT COUNT(*) AS resolved FROM incidents WHERE status = 'resolved';"),
        ("R5", "READ", "Dashboard: all 3 counts in one CTE",
         "WITH counts AS (SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status NOT IN ('resolved','closed')) AS active, COUNT(*) FILTER (WHERE status = 'resolved') AS resolved FROM incidents) SELECT total, active, resolved FROM counts;"),
        ("R6", "READ", "Rank incidents by severity per hazard type",
         "SELECT incident_code, title, hazard_type, severity, status, RANK() OVER (PARTITION BY hazard_type ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'moderate' THEN 3 WHEN 'low' THEN 4 END) AS severity_rank FROM incidents ORDER BY hazard_type, severity_rank;"),
        ("R7", "READ", "Running count of incidents over time",
         "SELECT incident_code, title, created_at::DATE AS reported_date, ROW_NUMBER() OVER (ORDER BY created_at) AS incident_number, COUNT(*) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM incidents ORDER BY created_at;"),
        ("W1", "WRITE", "Create a new incident",
         "INSERT INTO incidents (id, incident_code, title, hazard_type, severity, status, description, location_name, updated_at) VALUES (gen_random_uuid()::text, 'INC-2026-9999', 'Benchmark Test Incident', 'flood', 'high', 'reported', 'Test description', 'Guwahati, Assam', now()) RETURNING id, incident_code, title, hazard_type, severity, status, description, location_name, created_at, updated_at;"),
        ("W2", "WRITE", "Update incident fields by ID",
         f"UPDATE incidents SET title = COALESCE('Updated Flood Alert', title), hazard_type = COALESCE(NULL, hazard_type), severity = COALESCE('critical', severity), status = COALESCE('active', status), description = COALESCE(NULL, description), location_name = COALESCE(NULL, location_name), updated_at = now() WHERE id = '{sample_inc_id}' RETURNING id, incident_code, title, hazard_type, severity, status, description, location_name, created_at, updated_at;"),
        ("W3", "WRITE", "Delete an incident by ID",
         f"DELETE FROM incidents WHERE id = '{sample_inc_id}';"),
        ("W4", "WRITE", "Create a new user",
         "INSERT INTO users (id, email, name, password_hash) VALUES (gen_random_uuid()::text, 'bench_new_user@resqgrid.local', 'Bench User', '$2b$10$dG4mvKUgkry530irWQslr.DUMMYHASHVALUEFORBENCHMARK000000') RETURNING id, email, name, created_at;"),
    ]

    scan_re = re.compile(
        r"(?:Parallel )?(Seq Scan|Index Scan|Index Only Scan|Bitmap Heap Scan|Bitmap Index Scan)"
        r"(?: Backward)?(?: using [a-z0-9_]+)? on [a-z0-9_]+"
    )

    for qid, qtype, _desc, sql in queries:
        times = []
        plan_chunks = []
        last_plan = ""
        for run in range(1, 4):
            if qtype == "WRITE":
                stmt = f"BEGIN; EXPLAIN (ANALYZE, BUFFERS) {sql} ROLLBACK;"
            else:
                stmt = f"EXPLAIN (ANALYZE, BUFFERS) {sql}"
            plan = run_psql(stmt)
            plan_chunks.append(f"=== {qid} run {run} ===\n{plan}\n")
            match = re.search(r"Execution Time: ([0-9.]+) ms", plan)
            times.append(float(match.group(1)))
            last_plan = plan

        with open(os.path.join(PLANS_DIR, f"{qid}.txt"), "w") as f:
            f.write("\n".join(plan_chunks))

        scans = []
        for m in scan_re.finditer(last_plan):
            node = m.group(0).replace("Parallel ", "").replace(" Backward", "")
            if node not in scans:
                scans.append(node)
        scan_str = " | ".join(scans) if scans else "—"
        avg = sum(times) / 3.0
        print(f"{qid:<4} {qtype:<5} {times[0]:7.3f} {times[1]:7.3f} {times[2]:7.3f} avg={avg:7.3f}  {scan_str}")

    u_cnt = run_psql("SELECT count(*) FROM users;")
    i_cnt = run_psql("SELECT count(*) FROM incidents;")
    print(f"\nSaved raw plans to {PLANS_DIR}")
    print(f"Row counts after rollbacks: users={u_cnt}, incidents={i_cnt}")


if __name__ == "__main__":
    main()