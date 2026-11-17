-- 03_schema.sql — PostgreSQL CREATE TABLE statements for ResQGrid
-- Run: psql -U postgres -d resqgrid -f 03_schema.sql


-- Drop existing tables (safe re-run — child table before parent)
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS users;



-- TABLE: users
-- Stores admin/staff accounts. Passwords stored as bcrypt hashes only.
-- Primary key   : id 
-- Candidate key : email
CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,          -- candidate key
    name          TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,                 -- bcrypt hash, never plain text
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);



-- TABLE: incidents
-- Core entity. Each incident may be linked to the user who created it.
-- Primary key   : id 
-- Candidate key : incident_code 
-- Foreign key   : created_by → users(id)
CREATE TABLE incidents (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code TEXT        NOT NULL UNIQUE,          -- candidate key
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
    description   TEXT,                                 -- optional field
    location_name TEXT,                                 -- optional field
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by    UUID        REFERENCES users(id)      -- FK: many incidents → one user
                              ON DELETE SET NULL         -- keep incident if user is deleted
);



-- Indexes- makes database searches faster = not need for small dataset as sequencial scans are fast enough

-- idx_incidents_status: dashboard queries filter by status
CREATE INDEX idx_incidents_status      ON incidents(status);

-- idx_incidents_hazard:  filter incidents list by hazard type
CREATE INDEX idx_incidents_hazard_type ON incidents(hazard_type);

-- idx_incidents_created: ORDER BY created_at DESC (default sort for list page)
CREATE INDEX idx_incidents_created_at  ON incidents(created_at DESC);

-- idx_incidents_creator: JOIN incidents → users ON created_by = users.id
CREATE INDEX idx_incidents_created_by  ON incidents(created_by);