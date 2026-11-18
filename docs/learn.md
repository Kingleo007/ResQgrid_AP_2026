# ResQGrid Backend — Presentation Script

This guide is a simple speaking script for explaining the backend to beginners. It follows the topics in the class screenshots and connects each topic to the files in this project.

## 1. Backend development and client-server architecture

**Say:** “ResQGrid uses a client-server design. The frontend is the client: it shows pages and sends requests. The backend is a Node.js server: it receives those requests, checks them, reads or changes data, and sends a response. PostgreSQL stores the long-term data.”

For example, when a user opens the incidents page, the frontend asks the backend for incidents. The backend reads incident rows from PostgreSQL and returns JSON. The frontend then displays that JSON.

**Files to point to:**

- `backend/src/server.js` starts the HTTP server.
- `backend/src/app.js` creates the Express application and connects middleware and routes.
- `backend/src/routes/` maps URL paths and HTTP methods to controller functions.
- `backend/src/controllers/` handles each request and prepares a response.
- `backend/src/models/` contains database queries.
- `backend/src/db/prisma.js` creates the shared Prisma database client.
- `backend/prisma/schema.prisma` describes the database tables and fields.

## 2. Node.js, HTTP server, and request flow

**Say:** “Node.js runs JavaScript outside the browser. ResQGrid uses Express, a Node.js library that makes it easier to build an HTTP server. The server listens on the port in the environment settings, which is 4000 by default.”

The frontend sends an HTTP request. It has a method, a URL, headers, and sometimes a body. The backend matches the method and URL to a route, runs middleware and a controller, then returns an HTTP status and usually JSON.

**Files to point to:**

- `backend/src/server.js` calls `app.listen(...)` and handles `SIGTERM` for a graceful shutdown.
- `backend/src/config/env.js` reads settings such as `PORT`, `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN`.
- `backend/src/app.js` registers Express middleware and mounts the routes.

### HTTP methods and URL parts

An HTTP method describes what the client wants to do. In this API:

- `GET /api/incidents` reads the incident list.
- `POST /api/incidents` creates an incident; its fields are sent in the request body.
- `GET /api/incidents/:id` reads one incident. `:id` is a route parameter, for example `/api/incidents/abc123`.
- `PUT /api/incidents/:id` updates an incident.
- `DELETE /api/incidents/:id` removes an incident.
- `POST /api/auth/login` checks login details.

In a URL such as `http://localhost:4000/api/incidents/abc123?view=full`, the protocol is `http`, the host is `localhost`, the port is `4000`, the path is `/api/incidents/abc123`, and the query string is `view=full`. The current incident routes use a path parameter (`:id`); they do not define query-string filters.

### Headers, request bodies, and status codes

Headers carry information about a request or response, such as its content type or authentication cookie. `express.json()` in `app.js` reads JSON request bodies and makes the data available as `req.body`. `cookieParser()` reads cookies and makes them available as `req.cookies`.

The backend uses common HTTP status codes:

- `200` means the request succeeded.
- `201` means a new resource was created.
- `204` means it succeeded and has no response body (used after deleting an incident).
- `400` means the submitted data is invalid.
- `401` means login is missing or invalid.
- `404` means the route or incident was not found.
- `409` means the email is already in use.
- `500` means an unexpected server error occurred.

## 3. Express routing and REST API

**Say:** “A route connects an HTTP method and URL to the code that handles it. ResQGrid groups routes by feature, then `app.js` mounts each group under a common path. This keeps the API organized.”

| URL prefix | Route file | What it provides |
| --- | --- | --- |
| `/health` and `/api/health` | `backend/src/routes/health.js` | Checks that the server can reach the database; no login required. |
| `/api/auth` | `backend/src/routes/auth.js` | Login, logout, and current-user endpoints. |
| `/api/incidents` | `backend/src/routes/incidents.js` | Create, read, update, and delete incidents. All these routes require login. |
| `/api/dashboard` | `backend/src/routes/dashboard.js` | Returns incident counts; requires login. |
| `/api/users` | `backend/src/routes/users.js` | Creates a user; requires login. |

The route prefix is added in `backend/src/app.js`. For example, `router.post('/login', ...)` in `auth.js` becomes `POST /api/auth/login` because the router is mounted at `/api/auth`.

This is a REST-style API: URLs name resources such as `incidents`, while HTTP methods say what to do with them. The project currently uses `/api/...` prefixes; it does not use a numbered version such as `/api/v1`.

## 4. Middleware and MVC-style organization

**Say:** “Middleware is code that runs while a request travels through the server. It can prepare the request, check it, or stop it with an error. We organize the backend in a way similar to MVC: routes receive requests, controllers handle the request/response work, and models access stored data.”

This is a practical MVC-style separation, not a full separate view layer. The frontend is the view; this backend returns JSON.

The request pipeline in `backend/src/app.js` is:

1. `helmet()` adds common security headers.
2. `cors(...)` allows the configured frontend origin to make requests with cookies.
3. `express.json()` parses JSON request bodies.
4. `cookieParser()` parses browser cookies.
5. `requestLogger` records the method, path, status, and response time.
6. The matching route runs; routes may run authentication and validation middleware first.
7. If no route matches, the app returns a JSON `404` response.
8. `errorHandler` formats errors in one place. It is registered last so it can handle errors passed through Express.

**Files to point to:**

- `backend/src/middleware/validate.js` checks a body using a Zod schema.
- `backend/src/middleware/authenticate.js` checks the JWT cookie and attaches the user to `req.user`.
- `backend/src/middleware/requestLogger.js` records request details when the response finishes.
- `backend/src/middleware/errorHandler.js` turns errors into JSON responses.
- `backend/src/utils/logger.js` prints structured log messages and redacts sensitive fields.

## 5. Request validation

**Say:** “The server should not assume that data from a browser is correct. Before a controller saves input, validation middleware checks that the required fields and values have the right shape.”

The schemas live in `backend/src/validators/`:

- `authValidator.js` checks that login includes an email and password.
- `incidentValidator.js` checks incident fields such as title, hazard type, severity, and status.
- `userValidator.js` checks name, email, and password when creating a user.

The `validate(schema)` middleware returns a `400` response with validation details if the input is invalid. If it is valid, the parsed data replaces `req.body` and the request continues to the controller.

## 6. Controllers and models

**Say:** “A controller coordinates one API action. It reads the request, calls a model or database query, and sends the HTTP response. A model contains the database operations so controllers do not need to write SQL or Prisma queries directly.”

| File | Responsibility |
| --- | --- |
| `backend/src/controllers/authController.js` | Looks up a user, checks the password, creates or clears the login cookie, and returns the current user. |
| `backend/src/controllers/incidentController.js` | Handles incident list, detail, create, update, and delete requests. |
| `backend/src/controllers/dashboardController.js` | Counts total, active, and resolved incidents. |
| `backend/src/controllers/userController.js` | Hashes a new user's password and asks the user model to create the record. |
| `backend/src/controllers/healthController.js` | Runs a small database query and reports whether the service is healthy. |
| `backend/src/models/incidentModel.js` | Reads and changes incident rows through Prisma; generates an incident code for new incidents. |
| `backend/src/models/userModel.js` | Finds and creates users through Prisma; excludes password hashes from normal user responses. |

The model functions are asynchronous because they wait for PostgreSQL. Controllers use `await` and pass failures to `next(err)`, where the central error handler can respond.

## 7. Database, Prisma ORM, and connection pooling

**Say:** “PostgreSQL is the database. Prisma is an ORM, which means it lets JavaScript code work with database tables through objects and methods. The Prisma schema describes the data model, and the generated Prisma client provides methods such as `prisma.incident.findMany()`.”

The main database files are:

- `backend/prisma/schema.prisma` describes the `User` and `Incident` models. Prisma maps these to the `users` and `incidents` tables.
- `backend/prisma7.config.ts` tells Prisma where the schema and migrations are and supplies the database URL from the environment.
- `backend/src/db/prisma.js` builds one shared Prisma client. It creates a PostgreSQL connection pool using `pg`, then connects that pool to Prisma through the Prisma PostgreSQL adapter.
- `backend/src/models/userModel.js` and `backend/src/models/incidentModel.js` use the shared client for database queries.
- `backend/db/seed.js` creates the initial administrator account if it does not already exist. It is run explicitly with `npm run db:seed`; starting the server does not seed data automatically.

A connection pool keeps a reusable set of database connections. This avoids opening a brand-new database connection for every query. The Prisma 7 adapter in `src/db/prisma.js` connects Prisma to the `pg` pool.

The current schema has two models: `User` and `Incident`. It does not declare Prisma relations between them. Fields such as IDs and timestamps describe each record, and `@map`/`@@map` connect JavaScript-friendly names to database column or table names.

## 8. Authentication: password, JWT, cookie, and middleware

**Say:** “When a user logs in, the server checks the password against a saved bcrypt hash. If it matches, the server signs a JWT and sends it in an HTTP-only cookie. On later protected requests, middleware reads and verifies that cookie before allowing the route to continue.”

The flow is:

1. `POST /api/auth/login` sends email and password in JSON.
2. `authValidator.js` checks the input.
3. `authController.js` uses `userModel.findByEmail()` and `bcrypt.compare()`.
4. If credentials match, `jsonwebtoken` signs a token using `JWT_SECRET`.
5. The token is returned in a cookie named `token`. The cookie is `httpOnly`, so browser JavaScript cannot read it.
6. Protected routes run `authenticate.js`. It verifies the token and adds its user details to `req.user`.
7. `POST /api/auth/logout` clears the cookie; `GET /api/auth/me` returns the authenticated user's details.

The browser sends the cookie back with requests when the frontend uses credentials. `app.js` enables credentialed CORS for the configured frontend origin. This project uses JWT-in-a-cookie authentication; it does not implement a server-side session store.

## 9. Event-driven programming, EventEmitter, streams, and async work

**Say:** “Node.js is event-driven. Instead of waiting idly for slow work such as a database query, it can work on other requests and continue when the database result is ready. In our code, `async` functions and `await` make this non-blocking work easier to read.”

Examples in this backend:

- Database operations in models and controllers use asynchronous Prisma calls.
- `requestLogger.js` listens for the response `finish` event with `res.on('finish', ...)` and logs after the response is sent.
- `server.js` listens for the process `SIGTERM` event so the server can stop accepting requests and close cleanly.

Node.js uses the V8 JavaScript engine to run JavaScript and uses libuv to help manage asynchronous I/O and events. These are Node.js runtime internals; this project does not configure V8 or libuv directly. The backend does not currently use Node.js streams explicitly for application data.

## 10. Node.js modules: `process`, `fs`, and `path`

**Say:** “Node provides built-in modules for interacting with the running process and filesystem. This backend uses process information for configuration and shutdown. It does not currently import the `fs` or `path` modules in the application code.”

- `process.env` is used by `backend/src/config/env.js` and the Prisma setup to read environment variables.
- `process.on('SIGTERM', ...)` in `backend/src/server.js` handles a shutdown event.
- `fs` is Node's file-system module and `path` helps build operating-system-safe file paths; neither is currently part of the backend request flow.

## 11. End-to-end example: creating an incident

**Say:** “Here is the full path for a real request. The logged-in frontend sends a POST request with incident fields. Express parses its JSON and cookie. The incidents router checks the login and validates the body. The controller asks the incident model to create the row. Prisma sends the database operation through the PostgreSQL adapter and pool. The controller returns the new incident as JSON with status 201.”

In code, follow this chain:

`backend/src/app.js` → `backend/src/routes/incidents.js` → `backend/src/middleware/authenticate.js` → `backend/src/middleware/validate.js` → `backend/src/controllers/incidentController.js` → `backend/src/models/incidentModel.js` → `backend/src/db/prisma.js` → PostgreSQL.

If something fails, the controller passes the error to Express, and `backend/src/middleware/errorHandler.js` formats the response.

## 12. Quick backend file map

```text
backend/
├── src/
│   ├── server.js                 Starts the HTTP server
│   ├── app.js                    Middleware, route mounting, 404, error handler
│   ├── config/env.js             Reads and checks environment variables
│   ├── db/prisma.js              Shared Prisma client and PostgreSQL pool
│   ├── routes/                   Maps HTTP methods and URLs to handlers
│   ├── controllers/              Reads requests and sends responses
│   ├── middleware/               Authentication, validation, logging, errors
│   ├── validators/               Zod rules for request bodies
│   ├── models/                   Database queries
│   └── utils/logger.js           Structured, sanitized logging
├── prisma/
│   └── schema.prisma             Database models and field mappings
├── prisma7.config.ts             Prisma CLI configuration
└── db/seed.js                   Creates the initial admin account when run
```

## 13. A note about files not in the active request flow

`backend/src/services/incidentService.js` and the hazard/severity mapping files are present in the source tree, but the current incident routes and controllers do not import them. The active incident route flow goes directly from `incidentController.js` to `incidentModel.js`. Treat those files as inactive code unless they are connected to routes later.

## Closing summary

**Say:** “ResQGrid's backend is an Express API running on Node.js. Routes match HTTP requests, middleware checks and prepares them, controllers coordinate the work, models use Prisma to access PostgreSQL, and JSON responses go back to the frontend. Login uses bcrypt, JWT, and an HTTP-only cookie. This separation makes it easier to find where a request is handled and where its data is stored.”
