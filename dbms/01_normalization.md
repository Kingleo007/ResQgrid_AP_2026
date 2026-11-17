# 01 — Normalisation of ResQGrid Data

The app has two tables: **users** and **incidents**.
To show the normalisation steps, we start from a single flat table that could have
been built before any design — imagine a spreadsheet someone made to track incidents.

---

## Step 0 — The Raw Flat Table (Unnormalised)

Everything is in one table called `incident_log`:

```
incident_log(
  incident_code,
  title,
  hazard_type,
  severity,
  status,
  description,
  location_name,
  created_at,
  updated_at,
  reporter_email,
  reporter_name,
  reporter_password_hash
)
```

**Problems visible immediately:**
- `reporter_name` and `reporter_password_hash` repeat on every row for the same reporter → **data redundancy**
- If we update `reporter_name` for admin, we must update every row they reported → **update anomaly**
- We cannot add a user to the system unless they have reported at least one incident → **insertion anomaly**
- If we delete the only incident reported by a user, we lose that user's record entirely → **deletion anomaly**

---

## Step 1 — First Normal Form (1NF)

**Rule:**  One value per cell; no lists hiding inside cells

**Check on `incident_log`:**

| Rule | Satisfied? | Reason |
|---|---|---|
| Atomic values | ✅ Yes | Every cell holds one value (no lists, no arrays) |
| No repeating groups | ✅ Yes | Each column appears exactly once |
| Primary key exists | ✅ Yes | `incident_code` uniquely identifies each row |

**Result: `incident_log` is already in 1NF.**

---

## Step 2 — All Functional Dependencies

A functional dependency `A → B` i.e A determines B

```
FD1:  incident_code → title
FD2:  incident_code → hazard_type
FD3:  incident_code → severity
FD4:  incident_code → status
FD5:  incident_code → description
FD6:  incident_code → location_name
FD7:  incident_code → created_at
FD8:  incident_code → updated_at
FD9:  incident_code → reporter_email
FD10: reporter_email → reporter_name
FD11: reporter_email → reporter_password_hash
```

**Key attributes:** `incident_code` is the only primary key (single-attribute key).

**Prime attributes:** `{incident_code}` only.

**Non-prime attributes:** Everything else — title, hazard_type, severity, status, description,
location_name, created_at, updated_at, reporter_email, reporter_name, reporter_password_hash.

---

## Step 3 — Second Normal Form (2NF)

**Rule:** No partial dependencies

A partial dependency only exists when the primary key is **composite** (multi-attribute).

Since our primary key is `incident_code` (a single attribute), no partial dependency is possible.

**Result: `incident_log` is in 2NF .**

---

## Step 4 — Third Normal Form (3NF)

**Rule:** Must be in 2NF AND no non-prime attribute must transitively depend on the primary key
through another non-prime attribute.

**Transitive dependencies:**

```
incident_code → reporter_email → reporter_name
incident_code → reporter_email → reporter_password_hash
```

Here:
- `reporter_email` is a **non-prime** attribute 
- `reporter_name` and `reporter_password_hash` are determined by `reporter_email`, not directly by `incident_code`

**Fix: Decompose into two tables.**

Remove `reporter_email`, `reporter_name`, `reporter_password_hash` from `incident_log`.
Create a separate `users` table to hold them.

**After 3NF decomposition:**

```
users(
  id               ← primary key (UUID)
  email            ← candidate key (UNIQUE)
  name,
  password_hash,
  created_at
)

incidents(
  id               ← primary key (UUID)
  incident_code    ← candidate key (UNIQUE)
  title,
  hazard_type,
  severity,
  status,
  description,
  location_name,
  created_at,
  updated_at,
  created_by       ← foreign key → users.id  (links back to the reporter)
)
```

No non-prime attribute now depends on another non-prime attribute in either table.

**Result: Both tables are in 3NF.**

---

## Step 5 — Boyce-Codd Normal Form (BCNF)

**Rule:**  Every determinant must be a superkey.

**Check `users`:**

| Dependency | Is determinant a superkey? |
|---|---|
| `id → {email, name, password_hash, created_at}` | ✅ Yes — `id` is the primary key |
| `email → {id, name, password_hash, created_at}` | ✅ Yes — `email` is a candidate key (UNIQUE) |

**Check `incidents`:**

| Dependency | Is determinant a superkey? |
|---|---|
| `id → {incident_code, title, hazard_type, ...}` | ✅ Yes — `id` is the primary key |
| `incident_code → {id, title, hazard_type, ...}` | ✅ Yes — `incident_code` is a candidate key (UNIQUE) |

No determinant is a non-superkey. **Both tables are in BCNF. ✅**

---

## Final Tables After Full Normalisation

### `users`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | UUID | PRIMARY KEY | Surrogate key — auto-generated |
| email | TEXT | UNIQUE, NOT NULL | Candidate key — used for login |
| name | TEXT | NOT NULL | Display name |
| password_hash | TEXT | NOT NULL | bcrypt hash — never plain text |
| created_at | TIMESTAMP | DEFAULT now() | Auto-set on insert |

Candidate keys: **{id}**, **{email}**

### `incidents`

| Column | Type | Constraint | Notes |
|---|---|---|---|
| id | UUID | PRIMARY KEY | Surrogate key |
| incident_code | TEXT | UNIQUE, NOT NULL | Candidate key e.g. INC-2026-0001 |
| title | TEXT | NOT NULL | Short description |
| hazard_type | TEXT | NOT NULL | flood / fire / cyclone etc. |
| severity | TEXT | NOT NULL | low / moderate / high / critical |
| status | TEXT | DEFAULT 'reported' | Lifecycle stage |
| description | TEXT | NULL | Optional detail |
| location_name | TEXT | NULL | Optional place name |
| created_at | TIMESTAMP | DEFAULT now() | Auto-set |
| updated_at | TIMESTAMP | AUTO | Updated on every save |
| created_by | UUID | FK → users.id, NULL | The reporting user |

Candidate keys: **{id}**, **{incident_code}**

---

## Summary

| Normal Form | Rule | Status |
|---|---|---|
| 1NF | Atomic values, no repeating groups, has PK | ✅ Satisfied from the start |
| 2NF | No partial dependencies | ✅ Auto-satisfied (single-column PK) |
| 3NF | No transitive dependencies | ✅ After splitting reporter info into `users` |
| BCNF | Every determinant is a superkey | ✅ Both tables satisfy this |