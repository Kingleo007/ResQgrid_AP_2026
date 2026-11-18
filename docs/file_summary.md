| File | What it does |
| --- | --- |
| `backend/package.json` | Lists backend packages and commands. `npm run dev` starts `src/app.js` with automatic restarts; `npm start` starts it normally. The other scripts manage Prisma and database setup. |
| `backend/package-lock.json` | Records the exact installed package versions so installs are repeatable. |
| `backend/skills-lock.json` | Records tooling or skill dependencies used by this repository; it is not part of API request handling. |
| `backend/prisma7.config.ts` | Tells Prisma where the schema and migrations are and where to read the database URL. |
| `backend/prisma/schema.prisma` | Describes the database models, fields, and table names. It currently defines `User` and `Incident`. |
| `backend/db/seed.js` | Creates the initial administrator account when the seed command is run. It does not run every time the server starts. |

## `backend/src`

| File or folder | What it does |
| --- | --- |
| `app.js` | Main backend entry point. Sets up Express and middleware, mounts the API routes, returns 404 for unknown routes, handles errors, starts the server, and shuts it down when stopped. |
| `config/env.js` | Reads settings such as port, database URL, JWT secret, and frontend origin from environment variables. It stops startup if required settings are missing. |
| `db/prisma.js` | Creates the PostgreSQL connection pool and one shared Prisma client for database queries. |
| `routes/incidents.js` | Contains incident endpoints, incident validation hooks, database operations, incident totals, and response handling. It covers list/create/read/update/delete and dashboard counts. |
| `routes/users.js` | Contains login, logout, current-user, and user-creation endpoints, including their Prisma and password handling. |
| `middleware/authenticate.js` | Checks the JWT cookie on protected routes. If valid, it makes the user's details available as `req.user`; otherwise it returns an authentication error. |
| `middleware/errorHandler.js` | Converts errors passed by routes into JSON responses with an HTTP status. Unexpected server errors are also printed in the backend terminal. |
| `middleware/validate.js` | Runs a validation function before a route handler. If it reports invalid input, the middleware returns a 400 response with the reason. |
| `validators/authValidator.js` | Plain JavaScript checks for login email and password. |
| `validators/validators.js` | Plain JavaScript checks for creating and updating incidents and creating users. |
| `map/geo.js` | Geographic helper functions: calculates a polygon centre and converts CAP coordinate text to GeoJSON. |
| `config/hazardMap.js` | Converts hazard description text into a hazard category. |
| `config/severityMaps.js` | Converts earthquake magnitude or external alert levels into ResQGrid severity labels. |

## Main endpoint groups

| Endpoint | Handler location | What it does |
| --- | --- | --- |
| `POST /api/auth/login` | `routes/users.js` | Checks login details and sets the JWT cookie. |
| `POST /api/auth/logout` | `routes/users.js` | Clears the login cookie. |
| `GET /api/auth/me` | `routes/users.js` | Returns the logged-in user; requires a valid cookie. |
| `POST /api/users` | `routes/users.js` | Creates a user after checking the request and hashing the password. |
| `GET /api/incidents` | `routes/incidents.js` | Lists incidents. |
| `POST /api/incidents` | `routes/incidents.js` | Creates an incident. |
| `GET /api/incidents/:id` | `routes/incidents.js` | Gets one incident by ID. |
| `PUT /api/incidents/:id` | `routes/incidents.js` | Updates an incident. |
| `DELETE /api/incidents/:id` | `routes/incidents.js` | Deletes an incident. |
| `GET /api/dashboard` | `routes/incidents.js` | Returns total, active, and resolved incident counts. |

The incident, dashboard, and user endpoints require authentication. Login and logout do not; the current-user endpoint does.

## What the main packages are for

- **Express** receives HTTP requests and defines routes.
- **Prisma** provides database query methods based on the schema.
- **pg** provides the PostgreSQL connection pool used by Prisma's PostgreSQL adapter.
- **bcrypt** compares and creates password hashes.
- **jsonwebtoken** creates and verifies login tokens.
- **cookie-parser** makes cookies available to Express handlers.
- **cors** allows the configured frontend origin to make API requests and send cookies.
- **helmet** adds security-related HTTP response headers.
- **dotenv** loads environment variables from a `.env` file.
- **nodemon** restarts the development server after code changes.

## Map and mapping helper note

The geographic and hazard/severity helper files are present in the backend, but the current incident request handlers do not import them. They are separate helpers, not part of the active incident CRUD flow.
