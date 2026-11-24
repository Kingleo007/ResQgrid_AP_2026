# 05 — Query Timings (ResQGrid)

Measured on PostgreSQL database `resqgrid` (`102` users, `503` incidents) after `ANALYZE` using `python3 dbms/benchmarks/run_benchmark.py resqgrid`.
- Every query ran **3 times** with `EXPLAIN (ANALYZE, BUFFERS)`.
- All write queries (`W1`–`W4`) ran inside `BEGIN; ... ROLLBACK;` so the data did not change.
- Full raw plans for all 14 queries are saved in `dbms/plans/`.

## Timing Table

| Query | Type | What it does | Run 1 (ms) | Run 2 (ms) | Run 3 (ms) | Average (ms) | Scan type |
|---|---|---|---:|---:|---:|---:|---|
| R1 | READ | Login by email | 0.039 | 0.031 | 0.028 | 0.033 | Seq Scan on users |
| R2 | READ | List all incidents, newest first | 0.380 | 0.115 | 0.130 | 0.208 | Seq Scan on incidents |
| R3 | READ | Get one incident by ID | 0.042 | 0.033 | 0.033 | 0.036 | Index Scan using incidents_pkey on incidents |
| R4a | READ | Dashboard: total incident count | 0.077 | 0.069 | 0.069 | 0.072 | Seq Scan on incidents |
| R4b | READ | Dashboard: active incident count | 0.074 | 0.089 | 0.069 | 0.077 | Seq Scan on incidents |
| R4c | READ | Dashboard: resolved incident count | 0.060 | 0.060 | 0.075 | 0.065 | Seq Scan on incidents |
| R5 | READ | Dashboard: all 3 counts in one CTE | 0.077 | 0.075 | 0.075 | 0.076 | Seq Scan on incidents |
| R6 | READ | Rank incidents by severity per hazard type | 0.419 | 0.382 | 0.387 | 0.396 | Seq Scan on incidents |
| R7 | READ | Running count of incidents over time | 0.340 | 0.237 | 0.236 | 0.271 | Seq Scan on incidents |
| R8 | READ | Active incidents joined with hazard-type totals (`JOIN`) | 0.287 | 0.285 | 0.286 | 0.286 | Hash Join + Seq Scan on incidents |
| W1 | WRITE | Create a new incident | 0.979 | 0.127 | 0.136 | 0.414 | — |
| W2 | WRITE | Update incident fields by ID | 0.694 | 0.114 | 0.111 | 0.306 | Index Scan using incidents_pkey on incidents |
| W3 | WRITE | Delete an incident by ID | 0.088 | 0.070 | 0.070 | 0.076 | Index Scan using incidents_pkey on incidents |
| W4 | WRITE | Create a new user | 0.167 | 0.123 | 0.115 | 0.135 | — |
| **Total** | | **Sum of 14 averages** | | | | **2.451** | |

## Key Notes

- **Point lookups (`R3`, `W2`, `W3`)** use `Index Scan using incidents_pkey` (`0.036–0.306 ms`).
- **`R1` (`users` lookup by email)** chose `Seq Scan` (`0.033 ms`) because `users` is only 102 rows (~2 pages); at larger user counts PostgreSQL automatically uses `users_email_key`.
- **`R5` (single-pass CTE)** computes all three dashboard counts in `0.076 ms` vs `0.214 ms` combined for `R4a + R4b + R4c` (1 scan instead of 3).
- **`R8` (`JOIN`)** joins active incidents with per-hazard-type counts using a `Hash Join` (`0.286 ms`).
- **`R6` and `R7` (window functions)** sort all 503 rows for `RANK()` and `ROW_NUMBER()`/`COUNT() OVER` (`0.396 ms` and `0.271 ms`).
