-- 04_queries.sql — All SQL queries used by the ResQGrid app
-- Every query is marked -- READ or -- WRITE with an ID (R1..R8, W1..W4).


-- =====================================================================
-- READ QUERIES
-- =====================================================================

-- READ
-- R1: Login — find a user by email so the app can compare the password hash
-- Route   : POST /api/auth/login
-- Used by : authController.login → userModel.findByEmail
SELECT
    id,
    email,
    name,
    password_hash
FROM users
WHERE email = $1;          -- $1 = email submitted in the login form


-- READ
-- R2: List all incidents, newest first (Incidents page)
-- Route   : GET /api/incidents
-- Used by : incidentController.list → incidentModel.listAll
SELECT
    id,
    incident_code,
    title,
    hazard_type,
    severity,
    status,
    description,
    location_name,
    created_at,
    updated_at
FROM incidents
ORDER BY created_at DESC;


-- READ
-- R3: Get one incident by ID (Incident detail page)
-- Route   : GET /api/incidents/:id
-- Used by : incidentController.getOne → incidentModel.findById
SELECT
    id,
    incident_code,
    title,
    hazard_type,
    severity,
    status,
    description,
    location_name,
    created_at,
    updated_at
FROM incidents
WHERE id = $1;             -- $1 = incident ID from /incidents/:id


-- READ
-- R4a: Dashboard — total incident count
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS total
FROM incidents;


-- READ
-- R4b: Dashboard — count of active (not resolved or closed) incidents
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS active
FROM incidents
WHERE status NOT IN ('resolved', 'closed');


-- READ
-- R4c: Dashboard — count of resolved incidents
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS resolved
FROM incidents
WHERE status = 'resolved';


-- READ
-- R5: Combine the three dashboard counts into one query using a CTE
-- Shows   : Common Table Expression (WITH ... AS)
WITH counts AS (
    SELECT
        COUNT(*)                                                    AS total,
        COUNT(*) FILTER (WHERE status NOT IN ('resolved','closed')) AS active,
        COUNT(*) FILTER (WHERE status = 'resolved')                 AS resolved
    FROM incidents
)
SELECT total, active, resolved
FROM counts;


-- READ
-- R6: Rank incidents by severity within each hazard type
-- Shows   : RANK() window function with PARTITION BY and ORDER BY inside OVER()
SELECT
    incident_code,
    title,
    hazard_type,
    severity,
    status,
    RANK() OVER (
        PARTITION BY hazard_type
        ORDER BY
            CASE severity
                WHEN 'critical' THEN 1
                WHEN 'high'     THEN 2
                WHEN 'moderate' THEN 3
                WHEN 'low'      THEN 4
            END
    ) AS severity_rank
FROM incidents
ORDER BY hazard_type, severity_rank;


-- READ
-- R7: Running count of incidents over time
-- Shows   : COUNT() as a running total using ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
SELECT
    incident_code,
    title,
    created_at::DATE AS reported_date,
    ROW_NUMBER() OVER (ORDER BY created_at) AS incident_number,
    COUNT(*) OVER (
        ORDER BY created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM incidents
ORDER BY created_at;


-- READ
-- R8: Incidents joined with per-hazard-type totals (JOIN)
-- Purpose : Show each active/reported incident alongside how many total incidents exist for its hazard type
SELECT
    i.incident_code,
    i.title,
    i.hazard_type,
    i.severity,
    i.status,
    h.hazard_total
FROM incidents i
JOIN (
    SELECT hazard_type, COUNT(*) AS hazard_total
    FROM incidents
    GROUP BY hazard_type
) h ON h.hazard_type = i.hazard_type
WHERE i.status NOT IN ('resolved', 'closed')
ORDER BY h.hazard_total DESC, i.created_at DESC;


-- =====================================================================
-- WRITE QUERIES
-- =====================================================================

-- WRITE
-- W1: Create a new incident
-- Route   : POST /api/incidents
-- Used by : incidentController.create → incidentModel.createIncident
INSERT INTO incidents (
    id,
    incident_code,
    title,
    hazard_type,
    severity,
    status,
    description,
    location_name,
    updated_at
)
VALUES (
    gen_random_uuid()::text,
    $1,                  -- generated code e.g. INC-2026-0504
    $2,                  -- title
    $3,                  -- hazard_type
    $4,                  -- severity
    'reported',          -- all new incidents start as 'reported'
    $5,                  -- description (may be NULL)
    $6,                  -- location_name (may be NULL)
    now()                -- updated_at
)
RETURNING id, incident_code, title, hazard_type, severity, status,
          description, location_name, created_at, updated_at;


-- WRITE
-- W2: Update an incident's fields (status, title, severity etc.)
-- Route   : PUT /api/incidents/:id
-- Used by : incidentController.update → incidentModel.updateIncident
UPDATE incidents
SET
    title         = COALESCE($2, title),
    hazard_type   = COALESCE($3, hazard_type),
    severity      = COALESCE($4, severity),
    status        = COALESCE($5, status),
    description   = COALESCE($6, description),
    location_name = COALESCE($7, location_name),
    updated_at    = now()
WHERE id = $1
RETURNING id, incident_code, title, hazard_type, severity, status,
          description, location_name, created_at, updated_at;


-- WRITE
-- W3: Delete an incident permanently
-- Route   : DELETE /api/incidents/:id
-- Used by : incidentController.remove → incidentModel.deleteIncident
DELETE FROM incidents
WHERE id = $1;


-- WRITE
-- W4: Create a new user (password already bcrypt-hashed by the app)
-- Route   : POST /api/users
-- Used by : userController.create → userModel.createUser
INSERT INTO users (id, email, name, password_hash)
VALUES (gen_random_uuid()::text, $1, $2, $3)
RETURNING id, email, name, created_at;
