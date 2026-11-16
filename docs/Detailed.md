# ResQGrid — Disaster Monitoring Platform (India)

> **Current Status: Stage 2 Complete** (Backend Foundation + Ingestion & Intake API)
> Next: Stage 3 (Frontend shell + incidents)

ResQGrid is an admin-only, web-based disaster incident monitoring and response coordination platform for authorized personnel in India (disaster management administrators and operations staff). It aggregates warnings and alerts from official feeds (NDMA SACHET, IMD CAP, USGS, GDACS), places unverified items into an **Alert Intake Queue**, allows staff to **promote** alerts to managed **Incidents** or **dismiss** them, and tracks response team assignments through an audited state-machine workflow.

---

## 1. Alert → Incident Concept

**An alert is NOT an incident.** Alerts are unverified external items. Incidents are staff-confirmed records that get managed. Never auto-create incidents from feeds.

```
Official External Feeds
  (NDMA SACHET / IMD CAP / USGS / GDACS)
                 │
                 ▼
          [ alerts table ]             ← review_status: pending
                 │
         Staff Review & Intake
                 │
        ┌────────┴────────┐
        ▼                 ▼
   promote alert       dismiss
   (transaction)          │
        │                 ▼
        │          review_status: dismissed
        ▼
   [ incidents table ]                 ← status: reported → verified → responding
        │                                              → monitoring → resolved → closed
        ├──► [ assignments ] ◄──► [ teams ]
        │
        ▼
   [ incident_updates ]                ← audit timeline for every mutation
```

---

## 2. Architecture & MVC Mapping

The backend follows a clean MVC / Service-oriented architecture with pure parameterized SQL queries (no ORM) and transactional consistency.

```
backend/
├── src/
│   ├── config/          # env.js, severityMaps.js, hazardMap.js
│   ├── connectors/      # ndma_sachet.js, imd_cap.js, usgs_quakes.js, gdacs.js, registry.js
│   ├── controllers/     # auth, incident, alert, ingestion, team, assignment, health
│   ├── db/              # pool.js (single shared pg.Pool)
│   ├── middleware/      # authenticate, requireRole, validate, errorHandler, requestLogger
│   ├── models/          # userModel, incidentModel, alertModel, dataSourceModel, teamModel, assignmentModel
│   ├── routes/          # auth, incidents, alerts, ingestion, dashboard, teams, assignments, health
│   ├── services/        # incidentService (state machine), ingestionService (feed pipeline, promote txn), assignmentService
│   ├── utils/           # logger, httpFetch (timeout & User-Agent), geo (CAP polygon swap), capParser
│   ├── app.js           # Express app definition & middleware pipeline
│   └── server.js        # Server entry point + node-cron ingestion scheduler
├── db/
│   ├── migrations/      # 001_init.sql
│   ├── migrate.js       # Transactional migration runner (schema_migrations)
│   └── seed.js          # Idempotent database seeder (is_sample = true)
├── scripts/
│   ├── probe-sources.js # Probes external feeds once & logs response structure
│   └── ingest-once.js   # CLI runner: fetch & upsert feeds (--source=<key> optional)
└── test/
    ├── fixtures/        # cap_sachet_sample.xml, usgs_sample.json
    ├── auth.test.js
    ├── incidents.test.js
    └── ingestion.test.js
```

### MVC Mapping

| Layer | Path | Responsibility |
|---|---|---|
| **View** | React SPA (Stage 3+) / JSON envelopes | Presentation layer consuming the REST API |
| **Routes** | `src/routes/` | URL route definitions + middleware pipeline |
| **Controllers** | `src/controllers/` | Thin layer: parse requests, invoke services/models, format envelopes |
| **Services** | `src/services/` | Business rules, multi-table transactions (`withTransaction`), state machine |
| **Models** | `src/models/` | All parameterized SQL queries live exclusively here (no ORM) |
| **Connectors** | `src/connectors/` | External feed clients outputting `NormalizedAlert` objects |
| **Middleware** | `src/middleware/` | Auth guards (`httpOnly` JWT), RBAC, Zod validation, error envelope |

---

## 3. Feature Map (Stage 1 & Stage 2)

| Feature | UI Page / Component | API Endpoint | Controller | Service / Model | DB Tables |
|---|---|---|---|---|---|
| User Login | `LoginPage` | `POST /api/auth/login` | `authController.login` | `userModel.findByEmail` | `users` |
| Current Session | `AppShell` | `GET /api/auth/me` | `authController.me` | `userModel.findById` | `users` |
| User Logout | `Sidebar` | `POST /api/auth/logout` | `authController.logout` | — (clears cookie) | — |
| Dashboard Summary | `DashboardPage` | `GET /api/dashboard/summary` | `incidentController.getSummary` | `incidentModel.getSummary` | `incidents`, `alerts`, `incident_updates`, `data_sources` |
| List Incidents | `IncidentsPage` | `GET /api/incidents` | `incidentController.list` | `incidentModel.listIncidents` | `incidents` |
| Incident Map Markers | `MapPage` / `IncidentMap` | `GET /api/incidents/map` | `incidentController.listForMap` | `incidentModel.listForMap` | `incidents` |
| Create Incident | `IncidentFormDrawer` | `POST /api/incidents` | `incidentController.create` | `incidentService.createIncident` | `incidents`, `incident_updates` |
| Update Incident | `IncidentFormDrawer` | `PATCH /api/incidents/:id` | `incidentController.update` | `incidentService.updateIncidentFields` | `incidents`, `incident_updates` |
| Status Transition | `StatusChangeModal` | `PATCH /api/incidents/:id/status` | `incidentController.changeStatus` | `incidentService.changeStatus` | `incidents`, `incident_updates` |
| Activity Timeline | `ActivityTimeline` | `GET /api/incidents/:id/updates` | `incidentController.listUpdates` | `incidentUpdateModel.listUpdates` | `incident_updates` |
| Add Note | `ActivityTimeline` | `POST /api/incidents/:id/notes` | `incidentController.addNote` | `incidentUpdateModel.createUpdate` | `incident_updates` |
| Assign Team | `AssignmentPanel` | `POST /api/incidents/:id/assignments` | `incidentController.assignTeam` | `assignmentService.assignTeam` | `assignments`, `teams`, `incident_updates` |
| Update Assignment | `AssignmentPanel` | `PATCH /api/assignments/:id` | `assignmentController.update` | `assignmentService.updateAssignment` | `assignments`, `teams`, `incident_updates` |
| List Teams | `AssignmentModal` | `GET /api/teams` | `teamController.list` | `teamModel.listTeams` | `teams` |
| Manage Teams | Admin Settings | `POST /api/teams`, `PATCH /api/teams/:id` | `teamController.create/update` | `teamModel.createTeam/updateTeam` | `teams` |
| Alert Intake Queue | `AlertIntakePage` | `GET /api/alerts` | `alertController.list` | `alertModel.listAlerts` | `alerts` |
| Alert Map Layer | `MapPage` | `GET /api/alerts/map` | `alertController.listForMap` | `alertModel.listForMap` | `alerts` |
| Alert Details | `AlertDrawer` | `GET /api/alerts/:id` | `alertController.getOne` | `alertModel.findById` | `alerts` |
| Promote Alert | `PromoteModal` | `POST /api/alerts/:id/promote` | `alertController.promote` | `ingestionService.promoteAlert` | `alerts`, `incidents`, `incident_updates` |
| Dismiss Alert | `AlertDrawer` | `POST /api/alerts/:id/dismiss` | `alertController.dismiss` | `alertModel.markDismissed` | `alerts` |
| Source Health | `SourceHealthStrip` | `GET /api/ingestion/sources` | `ingestionController.listSources` | `dataSourceModel.listSources` | `data_sources` |
| Trigger Ingestion | `SourceHealthStrip` | `POST /api/ingestion/run` | `ingestionController.triggerRun` | `ingestionService.runSource/runAll` | `data_sources`, `alerts` |

---

## 4. Official Data Sources

| Key | Name / Source | Endpoint | Polling | License / Attribution Notes | Known Limitations & Fallbacks |
|---|---|---|---|---|---|
| `ndma_sachet` | NDMA SACHET (CAP alerts from IMD, CWC, INCOIS, state authorities) | `https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml` | 15 min | Official Government of India feed. Terms of use not verified for redistribution; intended for administrative monitoring. | RSS embeds CAP fields or links to CAP XML. Coordinates in CAP are `lat,lon` and converted to GeoJSON `[lon, lat]` with centroid calculation. If no geometry, `lat`/`lng` is stored as null with a "No map location" label. |
| `imd_cap` | IMD CAP Weather Warnings | `https://cap-sources.s3.amazonaws.com/in-imd-en/rss.xml` | 30 min | IMD meteorological warnings. Terms not verified. | Endpoint URL sourced from community mirrors. Verified via `probe-sources`; if unreachable, marked `enabled=false` in `data_sources`. |
| `usgs_quakes` | USGS Earthquake Hazards Program | `https://earthquake.usgs.gov/fdsnws/event/1/query?...` | 10 min | Public Domain (USGS). No API key required. | GeoJSON filtered to India bounding box (6–37.5°N, 68–98°E, M≥4.5). Severity calculated via heuristic mapping (≥7.0 critical, 6.0–6.9 high, 5.0–5.9 moderate). |
| `gdacs` | GDACS Global Disaster Alert Coordination System (UN/EC) | `https://www.gdacs.org/xml/rss.xml` | 60 min | Public UN/EC disaster alert feed. Free access. | Global RSS feed filtered to India via country/ISO3 tags and coordinate bounding box fallback. Alert levels (Red→critical, Orange→high, Green→low). |

---

## 5. Commands

```bash
# --- 1. Infrastructure ---
docker compose up -d                      # Starts PostgreSQL 15 on :5432

# --- 2. Backend Setup ---
cd backend
cp .env.example .env                      # Configure PORT, DATABASE_URL, JWT_SECRET
npm install
npm run db:migrate                        # Applies 001_init.sql to PostgreSQL
npm run db:seed                           # Seeds default users, sample teams, incidents & alerts

# --- 3. External Feed Ingestion ---
npm run probe:sources                     # Probe live external feeds & print response structure
npm run ingest:once                       # Run ingestion once for all enabled sources
npm run ingest:once -- --source=usgs_quakes # Run single source manually

# --- 4. Testing & Running ---
npm test                                  # Runs Vitest test suite (mocked DB, 32 unit & integration tests)
npm run dev                               # Starts dev server with nodemon on http://localhost:4000
npm start                                 # Starts production server with background scheduler
```

### Database Reset
To wipe and reinitialize the local database:
```bash
docker compose down -v
docker compose up -d
cd backend && npm run db:migrate && npm run db:seed
```

---

## 6. Default Dev Logins

> [!CAUTION]
> **Change these passwords before deploying to any production or publicly accessible environment.**
> These credentials are seeded by `db/seed.js` for development only.

| Email | Password | Role |
|---|---|---|
| `admin@resqgrid.local` | `Admin1234!` | `admin` |
| `operator@resqgrid.local` | `Operator1234!` | `operator` |

---

## 7. Role Permission Table

| Action | `admin` | `operator` | Enforcement |
|---|---|---|---|
| Login / Logout / Session (`/me`) | ✅ | ✅ | Public / Authenticated |
| View Dashboard Summary | ✅ | ✅ | Authenticated |
| List / View Incidents & Timeline | ✅ | ✅ | Authenticated |
| Create Incident (manual) | ✅ | ✅ | Authenticated |
| Edit Incident Fields | ✅ | ✅ | Authenticated |
| Change Incident Status | ✅ | ✅ | Authenticated (`incidentService` state machine) |
| **Reopen Resolved Incident** | ✅ | ❌ | Controller check (`req.user.role === 'admin'`) |
| **Delete Incident** | ✅ | ❌ | `requireRole('admin')` + sample/closed rule |
| Add Notes to Timeline | ✅ | ✅ | Authenticated |
| View / Assign Teams | ✅ | ✅ | Authenticated |
| Update Assignment Status | ✅ | ✅ | Authenticated |
| **Create / Update Teams** | ✅ | ❌ | `requireRole('admin')` |
| View Alert Intake Queue | ✅ | ✅ | Authenticated |
| Promote Alert to Incident | ✅ | ✅ | Authenticated (`withTransaction`) |
| Dismiss Alert | ✅ | ✅ | Authenticated |
| View Source Health | ✅ | ✅ | Authenticated |
| **Trigger Ingestion Run** | ✅ | ❌ | `requireRole('admin')` |

---

## 8. Troubleshooting

1. **`ECONNREFUSED` on port 5432 on startup / migrations**
   - **Cause:** PostgreSQL container is not running or still initializing.
   - **Fix:** Run `docker compose up -d` and check status with `docker compose ps`.

2. **`Invalid or expired token` (401) on API calls**
   - **Cause:** Missing or expired `token` httpOnly cookie, or `JWT_SECRET` changed across server restarts.
   - **Fix:** Log in again via `POST /api/auth/login` to obtain a fresh cookie. Ensure `JWT_SECRET` is static in `.env`.

3. **`VALIDATION_ERROR` (400) on incident or alert requests**
   - **Cause:** Zod schema validation failure.
   - **Fix:** Verify payload types. Coordinates (`lat`, `lng`) must be numbers (-90 to 90, -180 to 180), and enums must match exact case (`critical`, `high`, `flood`, `cyclone`, etc.).

4. **External source shows status `error` in source health**
   - **Cause:** Network connectivity issue or upstream feed format change.
   - **Fix:** Run `npm run probe:sources` to inspect the raw response and HTTP status code. If an endpoint is offline or permanently moved, toggle `enabled = false` in `data_sources`.

5. **`MISSING_COORDINATES` (400) when promoting an alert**
   - **Cause:** The external alert has no spatial coordinates (e.g., text-only district alert) and no coordinates were provided in the promote request body.
   - **Fix:** Provide `lat` and `lng` overrides in the `POST /api/alerts/:id/promote` request payload.

---

## 9. Intentionally Out of Scope (Do Not Build)

Civilian-facing features; public registration; password reset emails; user-management UI; full audit-log page; reports/analytics page; real-time WebSockets; push/SMS notifications; geocoding/search-as-you-type; PostGIS spatial extensions; file uploads; i18n; AI/prediction; mobile app; individual personnel/GPS tracking.
