# 05 — Query Timings

Measured on the seeded dataset: **1 user, 5 incidents**.
Run with `EXPLAIN (ANALYZE, BUFFERS)` — full plans are in `dbms/plans/`.

> On such a tiny dataset the planner uses Sequential Scans for most queries
> (cheaper than index lookups when the whole table fits in a few pages).
> Index Scans appear only on PK / UNIQUE lookups.

| ID | Description | Type | Rows Out | Plan Type | Planning (ms) | Execution (ms) |
|---|---|---|---|---|---|---|
| R1 | Find user by email (login) | READ | 1 | Index Scan on `users_email_key` | 0.10 | 0.03 |
| R2 | List all incidents, newest first | READ | 5 | Seq Scan + Sort | 0.12 | 0.04 |
| R3 | Get one incident + reporter name (LEFT JOIN) | READ | 1 | Index Scan + Hash Left Join | 0.31 | 0.09 |
| R4a | COUNT all incidents (dashboard total) | READ | 1 | Aggregate → Seq Scan | 0.10 | 0.05 |
| R4b | COUNT active incidents (dashboard) | READ | 1 | Aggregate → Seq Scan + filter | 0.10 | 0.05 |
| R4c | COUNT resolved incidents (dashboard) | READ | 1 | Aggregate → Seq Scan + filter | 0.09 | 0.04 |
| R5 | Health check (`SELECT 1`) | READ | 1 | Result (no table access) | 0.02 | 0.01 |
| R6 | CTE dashboard — all three counts in one query | READ | 1 | Aggregate → Seq Scan | 0.14 | 0.06 |
| R7 | Rank by severity per hazard type (window fn) | READ | 5 | Seq Scan → Sort → WindowAgg | 0.18 | 0.08 |
| R8 | Running total over time (window fn) | READ | 5 | Seq Scan → Sort → WindowAgg | 0.17 | 0.07 |
| W1 | Create incident (INSERT) | WRITE | 1 | Insert | 0.15 | 0.45 |
| W2 | Update incident (UPDATE) | WRITE | 1 | Index Scan on PK → Update | 0.13 | 0.38 |
| W3 | Delete incident (DELETE) | WRITE | 1 | Index Scan on PK → Delete | 0.11 | 0.31 |
| W4 | Create user (INSERT) | WRITE | 1 | Insert | 0.14 | 0.42 |

---

## Notes

**Why Seq Scan on most queries?**
PostgreSQL estimates that reading 5 rows sequentially costs less than the overhead
of an index lookup. The planner switches to index scans only when it expects to find
very few rows (< ~5% of the table). On 5 rows, a Sequential Scan wins for everything
except PK / UNIQUE filter lookups.

**Why Index Scan on R1 (email lookup) and R3 (id lookup)?**
Both queries use an equality filter on a UNIQUE column:
- R1 → `WHERE email = $1` hits the unique index on `users.email`
- R3 → `WHERE i.id = $1` hits the primary key index on `incidents.id`
PostgreSQL knows these return at most 1 row, so the index path is cheaper.

**Why do WRITE queries take longer than reads?**
Writes do more work per row: enforce CHECK constraints, update all indexes,
write a WAL (Write-Ahead Log) record for crash recovery, and stamp MVCC metadata
(`xmin` for INSERT, `xmax` for DELETE). This overhead shows up even on tiny tables.

**How to run EXPLAIN ANALYZE yourself:**
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT id, email, name, password_hash
FROM users
WHERE email = 'admin@resqgrid.local';
```
