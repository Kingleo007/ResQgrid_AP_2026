# 05 — Query Timings (ResQGrid)

Measured on PostgreSQL database `resqgrid` (`102` users, `503` incidents) after `ANALYZE`.
- Every query ran **3 times** with `EXPLAIN (ANALYZE, BUFFERS)`.
- All write queries (`W1`–`W4`) ran inside `BEGIN; ... ROLLBACK;` so the data did not change.
- Full raw plans for all 13 queries are saved in `dbms/plans/`.

## Timing Table

| Query | Type | What it does | Run 1 (ms) | Run 2 (ms) | Run 3 (ms) | Average (ms) | Scan type |
|---|---|---|---:|---:|---:|---:|---|
| R1 | READ | Login by email | 0.041 | 0.029 | 0.034 | 0.035 | Seq Scan on users |
| R2 | READ | List all incidents, newest first | 0.136 | 0.141 | 0.127 | 0.135 | Seq Scan on incidents |
| R3 | READ | Get one incident by ID | 0.037 | 0.044 | 0.031 | 0.037 | Index Scan using incidents_pkey on incidents |
| R4a | READ | Dashboard: total incident count | 0.082 | 0.075 | 0.075 | 0.077 | Seq Scan on incidents |
| R4b | READ | Dashboard: active incident count | 0.073 | 0.092 | 0.101 | 0.089 | Seq Scan on incidents |
| R4c | READ | Dashboard: resolved incident count | 0.069 | 0.062 | 0.092 | 0.074 | Seq Scan on incidents |
| R5 | READ | Dashboard: all 3 counts in one CTE | 0.082 | 0.078 | 0.091 | 0.084 | Seq Scan on incidents |
| R6 | READ | Rank incidents by severity per hazard type | 1.765 | 0.512 | 0.452 | 0.910 | Seq Scan on incidents |
| R7 | READ | Running count of incidents over time | 0.251 | 0.288 | 0.257 | 0.265 | Seq Scan on incidents |
| W1 | WRITE | Create a new incident | 0.169 | 0.154 | 0.159 | 0.161 | — |
| W2 | WRITE | Update incident fields by ID | 0.343 | 0.124 | 0.125 | 0.197 | Index Scan using incidents_pkey on incidents |
| W3 | WRITE | Delete an incident by ID | 0.078 | 0.076 | 0.083 | 0.079 | Index Scan using incidents_pkey on incidents |
| W4 | WRITE | Create a new user | 0.136 | 0.162 | 0.126 | 0.141 | — |
| **Total** | | **Sum of 13 averages** | | | | **2.284** | |

## Key Notes

- **Point lookups (`R3`, `W2`, `W3`)** use `Index Scan using incidents_pkey` and run under `0.2 ms`.
- **`R1` (`users` lookup by email)** chose `Seq Scan` (`0.035 ms`) because `users` is only 102 rows (~2 pages); at larger user counts PostgreSQL automatically uses `users_email_key`.
- **`R5` (single-pass CTE)** computes all three dashboard counts in `0.084 ms` vs `0.240 ms` combined for `R4a + R4b + R4c` (1 scan instead of 3).
- **`R6` and `R7` (window functions)** are the slowest reads (`0.910 ms` and `0.265 ms`) because they sort all 503 rows for `RANK()` and `ROW_NUMBER()`/`COUNT() OVER`.
