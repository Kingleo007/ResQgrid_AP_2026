-- 03_schema.sql — PostgreSQL CREATE TABLE statements for ResQGrid
-- Matches the live Prisma-managed tables in database: resqgrid (schema: public)
-- Run: psql -U karun -d resqgrid -f dbms/03_schema.sql

-- Drop existing tables (safe re-run)
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS users;

-- TABLE: users
-- Stores admin/staff accounts. Passwords stored as bcrypt hashes only.
-- Primary key   : id
-- Candidate key : email
CREATE TABLE users (
    id            TEXT         PRIMARY KEY,
    name          TEXT         NOT NULL,
    email         TEXT         NOT NULL UNIQUE,          -- candidate key
    password_hash TEXT         NOT NULL,                 -- bcrypt hash, never plain text
    created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: incidents
-- Core entity storing disaster/emergency incident reports.
-- Primary key   : id
-- Candidate key : incident_code
CREATE TABLE incidents (
    id            TEXT         PRIMARY KEY,
    incident_code TEXT         NOT NULL UNIQUE,          -- candidate key (e.g. INC-2026-0001)
    title         TEXT         NOT NULL,
    hazard_type   TEXT         NOT NULL
                               CHECK (hazard_type IN
                                 ('flood','fire','cyclone','earthquake','landslide','other')),
    severity      TEXT         NOT NULL
                               CHECK (severity IN
                                 ('low','moderate','high','critical')),
    status        TEXT         NOT NULL DEFAULT 'reported'
                               CHECK (status IN
                                 ('reported','active','contained','resolved','closed')),
    description   TEXT,                                  -- optional field
    location_name TEXT,                                  -- optional field
    created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP(3) NOT NULL
);

-- Automatic indexes created by PRIMARY KEY and UNIQUE constraints:
--   users_pkey                ON users(id)
--   users_email_key           ON users(email)
--   incidents_pkey            ON incidents(id)
--   incidents_incident_code_key ON incidents(incident_code)
