-- 04_queries.sql — All SQL queries used by the ResQGrid app
-- Each query has an ID 



-- READ QUERIES

-- R1 — READ
-- Purpose : Login — find a user by email so the app can compare the password hash
-- Route   : POST /api/auth/login
-- Used by : authController.login → userModel.findByEmail
SELECT
    id,
    email,
    name,
    password_hash
FROM users
WHERE email = $1;          -- $1 = email submitted in the login form


-- R2 — READ
-- Purpose : List all incidents, newest first (Incidents page)
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


-- R3 — READ
-- Purpose : Get one incident with the name of the user who created it (JOIN)
-- Route   : GET /api/incidents/:id
-- Used by : incidentController.getOne → incidentModel.findById
SELECT
    i.id,
    i.incident_code,
    i.title,
    i.hazard_type,
    i.severity,
    i.status,
    i.description,
    i.location_name,
    i.created_at,
    i.updated_at,
    i.created_by,
    u.name  AS reporter_name,
    u.email AS reporter_email
FROM   incidents i
LEFT JOIN users u ON u.id = i.created_by
WHERE  i.id = $1;          -- $1 = UUID from the URL /incidents/:id


-- R4a — READ
-- Purpose : Dashboard — total incident count
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS total
FROM incidents;


-- R4b — READ
-- Purpose : Dashboard — count of active (not resolved or closed) incidents
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS active
FROM incidents
WHERE status NOT IN ('resolved', 'closed');


-- R4c — READ
-- Purpose : Dashboard — count of resolved incidents
-- Route   : GET /api/dashboard
-- Used by : dashboardController.getStats
SELECT COUNT(*) AS resolved
FROM incidents
WHERE status = 'resolved';


-- R5 — READ
-- Purpose : Health check — verify the database connection is alive
-- Route   : GET /health
-- Used by : healthController.health
SELECT 1;


-- R6 — READ  (educational)
-- Purpose : Combine the three dashboard counts into one query using a CTE
-- Shows   : Common Table Expression (WITH ... AS)
WITH counts AS (
    SELECT
        COUNT(*)                                                   AS total,
        COUNT(*) FILTER (WHERE status NOT IN ('resolved','closed')) AS active,
        COUNT(*) FILTER (WHERE status = 'resolved')                AS resolved
    FROM incidents
)
SELECT total, active, resolved
FROM counts;


-- R7 — READ  (educational)
-- Purpose : Rank incidents by severity within each hazard type
-- Shows   : RANK() window function with PARTITION BY and ORDER BY inside OVER()
SELECT
    incident_code,
    title,
    hazard_type,
    severity,
    status,
    RANK() OVER (
        PARTITION BY hazard_type          -- restart rank for each hazard type
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


-- R8 — READ  (educational)
-- Purpose : Running count of incidents over time
-- Shows   : COUNT() as a running total using ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
SELECT
    incident_code,
    title,
    created_at::DATE   AS reported_date,
    ROW_NUMBER() OVER (ORDER BY created_at) AS incident_number,
    COUNT(*) OVER (
        ORDER BY created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )                  AS running_total
FROM incidents
ORDER BY created_at;




-- WRITE QUERIES


-- W1 — WRITE
-- Purpose : Create a new incident
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
    created_by
)
VALUES (
    gen_random_uuid(),   -- DB generates the UUID
    $1,                  -- generated code e.g. INC-2026-0006
    $2,                  -- title
    $3,                  -- hazard_type
    $4,                  -- severity
    'reported',          -- all new incidents start as 'reported'
    $5,                  -- description (may be NULL)
    $6,                  -- location_name (may be NULL)
    $7                   -- created_by user UUID (may be NULL)
)
RETURNING id, incident_code, title, hazard_type, severity, status,
          description, location_name, created_at, updated_at;


-- W2 — WRITE
-- Purpose : Update an incident's fields (status, title, severity etc.)
-- Route   : PUT /api/incidents/:id
-- Used by : incidentController.update → incidentModel.updateIncident
UPDATE incidents
SET
    title         = COALESCE($2, title),         -- keep old value if NULL is passed
    hazard_type   = COALESCE($3, hazard_type),
    severity      = COALESCE($4, severity),
    status        = COALESCE($5, status),
    description   = COALESCE($6, description),
    location_name = COALESCE($7, location_name),
    updated_at    = now()
WHERE id = $1
RETURNING id, incident_code, title, hazard_type, severity, status,
          description, location_name, created_at, updated_at;


-- W3 — WRITE
-- Purpose : Delete an incident permanently
-- Route   : DELETE /api/incidents/:id
-- Used by : incidentController.remove → incidentModel.deleteIncident
DELETE FROM incidents
WHERE id = $1;


-- W4 — WRITE
-- Purpose : Create a new user (password already bcrypt-hashed by the app)
-- Route   : POST /api/users
-- Used by : userController.create → userModel.createUser
INSERT INTO users (id, email, name, password_hash)
VALUES (gen_random_uuid(), $1, $2, $3)
RETURNING id, email, name, created_at;