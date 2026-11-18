# Backend Learning Map

Use this page to connect backend topics to the files that implement them. For the explanation of every individual file, see `docs/file_summary.md`.

## Request flow

Frontend request → `backend/src/app.js` → route module → validation/authentication middleware → Prisma query → PostgreSQL → JSON response.

`app.js` is both the Express setup and the server entry point. The incident routes and queries are together in `routes/incidents.js`. Login, logout, current-user, user creation, and their database work are together in `routes/users.js`.

## Topics and where to look

| Topic | Main files | What those files do |
| --- | --- | --- |
| Client/server and Node server | `backend/src/app.js`, `backend/package.json` | Starts the API and defines how requests enter the backend. |
| HTTP methods, URLs, request/response | `backend/src/app.js`, `backend/src/routes/incidents.js`, `backend/src/routes/users.js` | Mounts endpoints and reads request data or sends status codes and JSON. |
| Express middleware | `backend/src/app.js`, `backend/src/middleware/` | Sets security headers, CORS, parses JSON/cookies, checks authentication, validates input, and handles errors. |
| REST routing and route parameters | `backend/src/routes/incidents.js`, `backend/src/routes/users.js` | Defines endpoints such as `GET /api/incidents/:id` and `POST /api/auth/login`. |
| MVC-style structure | `backend/src/routes/`, `backend/src/middleware/`, frontend | Routes and handlers are combined in feature files; Prisma calls are there too. The frontend is the view. This is a compact MVC-style organization, not separate model/controller folders. |
| Validation | `backend/src/middleware/validate.js`, `backend/src/validators/` | Checks request bodies before the route continues. Login uses a native JavaScript validator; incident and user schemas support Zod's `safeParse` interface. |
| Database, driver, and pooling | `backend/src/db/prisma.js`, `backend/prisma/schema.prisma`, `backend/prisma7.config.ts` | Connects Prisma to PostgreSQL through `pg` and describes the User and Incident tables. |
| ORM and CRUD | `backend/src/routes/incidents.js`, `backend/src/routes/users.js` | Uses Prisma methods to create, find, update, delete, and count records. |
| Passwords, JWT, cookies, auth | `backend/src/routes/users.js`, `backend/src/middleware/authenticate.js` | Hashes/checks passwords, issues JWT cookies, and protects routes. There is no server-side session store. |
| Node async/event loop | `backend/src/routes/incidents.js`, `backend/src/routes/users.js`, `backend/src/app.js` | Uses async database calls and process signal handlers. V8/libuv are Node runtime internals, not configured by these files. |
| Node modules and process | `backend/package.json`, `backend/src/app.js`, `backend/src/config/env.js` | Uses ES module imports/exports, process signals, and environment variables. `fs` and `path` are not used in the current backend flow. |
| Geographic and hazard maps | `backend/src/map/geo.js`, `backend/src/config/hazardMap.js`, `backend/src/config/severityMaps.js` | Contains geographic conversions and hazard/severity mapping helpers. These files are currently not called by the incident API. |

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/auth/login` | Check credentials and set login cookie. |
| `POST /api/auth/logout` | Clear login cookie. |
| `GET /api/auth/me` | Return the logged-in user's details. |
| `POST /api/users` | Create a user; requires login. |
| `GET /api/incidents` | List incidents; requires login. |
| `POST /api/incidents` | Create incident; requires login. |
| `GET /api/incidents/:id` | Read an incident; requires login. |
| `PUT /api/incidents/:id` | Update an incident; requires login. |
| `DELETE /api/incidents/:id` | Delete an incident; requires login. |
| `GET /api/dashboard` | Return total, active, and resolved counts; requires login. |

The API has no health endpoint or per-request logger. Server startup and unexpected server errors still print to the backend terminal.
