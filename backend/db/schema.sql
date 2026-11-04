CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Field officer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location_name TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  severity TEXT NOT NULL CHECK (severity IN ('critical','high','moderate','low')),
  status TEXT NOT NULL DEFAULT 'Reported',
  description TEXT NOT NULL DEFAULT '',
  reported_by UUID REFERENCES users(id),
  assigned_team TEXT NOT NULL DEFAULT 'Awaiting team',
  affected_people INTEGER NOT NULL DEFAULT 0,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS incidents_location_idx ON incidents USING GIST(location);
CREATE INDEX IF NOT EXISTS incidents_active_idx ON incidents(severity, reported_at DESC) WHERE status <> 'Resolved';
