-- =============================================================================
-- 03_schema.sql — PostgreSQL CREATE TABLE statements for ResQGrid
-- Run this file against your database to create the full relational schema.
-- This matches the normalised design from 01_normalization.md.
-- Run: psql -U postgres -d resqgrid -f 03_schema.sql
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Drop existing tables (safe re-run — child table before parent)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS users;


-- ---------------------------------------------------------------------------
-- TABLE: users
-- Stores admin/staff accounts. Passwords stored as bcrypt hashes only.
--
-- Primary key   : id (UUID)
-- Candidate key : email (UNIQUE constraint enforces this)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,          -- candidate key
    name          TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,                 -- bcrypt hash, never plain text
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PostgreSQL automatically creates a unique index on email because of UNIQUE.
-- No manual index needed here — login queries (WHERE email = ?) will use it.


-- ---------------------------------------------------------------------------
-- TABLE: incidents
-- Core entity. Each incident may be linked to the user who created it.
--
-- Primary key   : id (UUID)
-- Candidate key : incident_code (UNIQUE constraint)
-- Foreign key   : created_by → users(id)
-- ---------------------------------------------------------------------------
CREATE TABLE incidents (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code TEXT        NOT NULL UNIQUE,          -- candidate key e.g. INC-2026-0001
    title         TEXT        NOT NULL,
    hazard_type   TEXT        NOT NULL
                              CHECK (hazard_type IN
                                ('flood','fire','cyclone','earthquake','landslide','other')),
    severity      TEXT        NOT NULL
                              CHECK (severity IN
                                ('low','moderate','high','critical')),
    status        TEXT        NOT NULL DEFAULT 'reported'
                              CHECK (status IN
                                ('reported','active','contained','resolved','closed')),
    description   TEXT,                                 -- nullable — optional field
    location_name TEXT,                                 -- nullable — optional field
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by    UUID        REFERENCES users(id)      -- FK: many incidents → one user
                              ON DELETE SET NULL         -- keep incident if user is deleted
);


-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- idx_incidents_status: dashboard queries filter by status
CREATE INDEX idx_incidents_status      ON incidents(status);

-- idx_incidents_hazard:  filter incidents list by hazard type
CREATE INDEX idx_incidents_hazard_type ON incidents(hazard_type);

-- idx_incidents_created: ORDER BY created_at DESC (default sort for list page)
CREATE INDEX idx_incidents_created_at  ON incidents(created_at DESC);

-- idx_incidents_creator: JOIN incidents → users ON created_by = users.id
CREATE INDEX idx_incidents_created_by  ON incidents(created_by);


-- ---------------------------------------------------------------------------
-- Design notes
-- ---------------------------------------------------------------------------

-- UUID primary keys instead of SERIAL:
--   UUIDs are globally unique and can be generated in app code before the INSERT.
--   No risk of collision if incidents ever come from multiple sources.

-- TIMESTAMPTZ instead of TIMESTAMP:
--   Stores timezone offset. Avoids ambiguity when the app or DB timezone changes.

-- CHECK constraints on hazard_type / severity / status:
--   Enforces valid values at the database level, independent of application code.
--   If the app sends 'FLOOD' instead of 'flood', the DB rejects it with an error.

-- ON DELETE SET NULL on created_by:
--   If a user account is deleted, their incidents remain but created_by becomes NULL.
--   Prevents losing incident records just because a user was removed.
