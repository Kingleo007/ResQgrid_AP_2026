# ResQGrid Backend: Topics and Code Map

This is a reference for learning the backend. For each topic, it explains the idea in plain language, points to the related files, and says what each file does in ResQGrid.

## How the backend fits together

The frontend sends an HTTP request. The backend receives it, checks it, performs work, and sends back a response. When saved data is needed, the backend uses Prisma to communicate with PostgreSQL.

    Frontend → server.js → app.js → middleware → route → controller → model → Prisma → PostgreSQL
                                                            response ← controller ← data ← database

## 1. Backend development and client-server architecture

**Topic:** The client is the program that asks for something. The server receives the request and responds. In ResQGrid, the frontend is the client, the Node.js backend is the server, and PostgreSQL stores application data.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/server.js | Starts the backend server and listens for requests. |
| backend/src/app.js | Sets up Express, middleware, routes, and error handling. |
| backend/src/routes/ | Defines which URLs and methods the server accepts. |
| backend/src/controllers/ | Handles each request and creates its response. |
| backend/src/models/ | Reads and writes application data. |
| backend/src/db/prisma.js | Connects application code to the database through Prisma. |

## 2. Node.js, the event loop, V8, libuv, and asynchronous work

**Topic:** Node.js runs JavaScript on the server. V8 runs the JavaScript code. The event loop and libuv help Node handle waiting work, such as database or network operations, while it can continue processing other work. async and await let the code work with these operations without blocking the server while it waits.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/controllers/ | Uses async functions and await while asking models or Prisma for data. |
| backend/src/models/ | Uses asynchronous Prisma calls to query PostgreSQL. |
| backend/src/middleware/requestLogger.js | Registers a callback for the response finish event; logs after the response is sent. |
| backend/src/server.js | Registers a callback for SIGTERM so the server can shut down cleanly. |

V8 and libuv are part of the Node.js runtime; this project does not configure them directly. The database calls are the main example of asynchronous, non-blocking work here.

## 3. Node.js modules, process, fs, and path

**Topic:** Modules split code into files that can import and export functions or values. Node also provides built-in modules for interacting with the running process and the file system.

| File or folder | Role in this topic |
| --- | --- |
| backend/package.json | Sets type to module, so backend JavaScript uses ES module import and export. |
| Files throughout backend/src/ | Import and export code to share responsibilities between modules. |
| backend/src/config/env.js | Reads environment settings from process.env. |
| backend/src/server.js | Uses process.on('SIGTERM', ...) to respond to a shutdown signal. |

fs is Node's file-system module and path helps create safe file paths. Neither is imported in the current backend request flow, so they are general Node topics rather than active ResQGrid features.

## 4. Client-server communication, HTTP, methods, and status codes

**Topic:** HTTP is the format the client and server use to communicate. A request has a method, URL, headers, and sometimes a body. A response has a status code, headers, and sometimes a body.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/server.js | Opens the HTTP server on the configured port. |
| backend/src/app.js | Parses JSON bodies, configures CORS, mounts routes, and returns a JSON 404 when no route matches. |
| backend/src/routes/ | Connects HTTP methods and URL paths to handlers. |
| backend/src/controllers/ | Reads request values and sends responses with status codes and JSON. |
| backend/src/middleware/errorHandler.js | Sends error responses with an appropriate status and JSON body. |

Methods used by the API include GET to read, POST to create or submit, PUT to update, and DELETE to remove. Examples include GET /api/incidents, POST /api/incidents, PUT /api/incidents/:id, and DELETE /api/incidents/:id.

Status codes used include 200 (success), 201 (created), 204 (success with no body), 400 (invalid input), 401 (not authenticated), 404 (not found), 409 (conflict), and 500 (server error).

## 5. HTTP routing, URL parts, headers, and request bodies

**Topic:** Routing means choosing code based on a request's method and URL. A URL has parts such as protocol, host, port, path, and optional query string. Headers carry extra request or response information. A body carries submitted data, often as JSON.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/app.js | Uses express.json() to parse JSON bodies and cookieParser() to parse cookies. Mounts route folders under URL prefixes. |
| backend/src/routes/ | Defines route paths and methods. :id in incident routes is a path parameter. |
| backend/src/controllers/ | Reads req.body, req.params, cookies, and sends response status/body. |
| backend/src/config/env.js | Provides CLIENT_ORIGIN; app.js uses it to configure CORS. |

For example, router.get('/:id', ...) in routes/incidents.js combined with the /api/incidents prefix in app.js handles GET /api/incidents/<id>. The current routes do not implement query-string filtering.

## 6. Express, requests, responses, static routes, and route parameters

**Topic:** Express is the Node.js web framework used to define routes and middleware. A handler receives req (request) and res (response). A route parameter is a named value in the path, such as :id.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/app.js | Creates the Express app and installs global middleware and route groups. |
| backend/src/routes/ | Defines Express routers and endpoint paths. |
| backend/src/controllers/ | Uses req to read input and res to return JSON, status codes, or an empty response. |
| backend/src/middleware/ | Runs shared request/response logic before or after route handlers. |

The backend does not currently serve static files with Express express.static(). The frontend is served separately; this API mainly returns JSON.

## 7. Express Router, REST APIs, resources, and API versioning

**Topic:** A router groups related endpoints. In a REST-style API, the URL usually names a resource and the HTTP method describes the operation. API versioning can add a prefix such as /v1 when versions are needed.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/routes/auth.js | Groups login, logout, and current-user endpoints. |
| backend/src/routes/incidents.js | Groups incident create, read, update, and delete endpoints. |
| backend/src/routes/dashboard.js | Defines the dashboard statistics endpoint. |
| backend/src/routes/users.js | Defines user creation. |
| backend/src/routes/health.js | Defines health-check endpoints. |
| backend/src/app.js | Mounts each router under /api/auth, /api/incidents, etc. |

The project has an /api prefix but no numbered API version such as /api/v1.

## 8. MVC architecture and the role of each layer

**Topic:** MVC stands for Model, View, Controller. Models handle data, controllers coordinate requests and responses, and views display information. ResQGrid follows a similar separation for its API, with the frontend providing the view. Routes and middleware are additional Express layers that direct and check requests.

| MVC/API part | ResQGrid files | Role |
| --- | --- | --- |
| Model | backend/src/models/ | Queries and changes database records. |
| View | Frontend application | Displays the JSON data returned by the backend. There is no server-rendered view folder in this backend. |
| Controller | backend/src/controllers/ | Reads request input, calls models or Prisma, and sends the response. |
| Route | backend/src/routes/ | Connects a URL and HTTP method to middleware and a controller. |
| Middleware | backend/src/middleware/ | Performs reusable checks and processing around route handlers. |

Example: routes/incidents.js selects incidentController.create; that controller calls incidentModel.createIncident; the model writes the record through Prisma.

## 9. Event-driven programming, EventEmitter, observer pattern, and streams

**Topic:** Event-driven code runs a callback when an event happens. An observer pattern lets code subscribe to events and be notified when they occur. Streams process data in smaller pieces, often useful for large files or network data.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/middleware/requestLogger.js | Uses res.on('finish', callback) to react when a response finishes. |
| backend/src/server.js | Uses process.on('SIGTERM', callback) to react to a shutdown signal. |
| backend/src/controllers/ and backend/src/models/ | Use async functions for database operations. |

These event listeners are examples of event-driven programming. The backend does not currently create a custom EventEmitter, observer/pub-sub system, or application data streams. res.on and process.on use Node/Express event APIs.

## 10. Database, database driver, and connection pooling

**Topic:** A database stores data. A driver provides a connection from application code to the database. A connection pool keeps reusable connections available so the application does not open a new connection for every query.

| File or folder | Role in this topic |
| --- | --- |
| PostgreSQL | Stores user and incident records. |
| pg package | PostgreSQL driver and pool implementation. |
| backend/src/db/prisma.js | Creates the pg.Pool using DATABASE_URL and shares it with Prisma. |
| backend/src/config/env.js | Reads the required DATABASE_URL. |
| backend/src/controllers/healthController.js | Runs a small query to check database connectivity. |

## 11. ORM, Prisma, schema, models, relations, and CRUD

**Topic:** An ORM maps database tables to objects in code. Prisma uses a schema to describe models and generates a client with query methods. CRUD means Create, Read, Update, and Delete.

| File or folder | Role in this topic |
| --- | --- |
| backend/prisma/schema.prisma | Defines Prisma models User and Incident, their fields, and table/column mappings. |
| backend/prisma7.config.ts | Configures Prisma CLI with schema location and database URL. |
| backend/src/db/prisma.js | Creates the Prisma 7 client with the PostgreSQL adapter and shared connection pool. |
| backend/src/models/userModel.js | User queries: find users and create users. |
| backend/src/models/incidentModel.js | Incident queries: create, list, find, update, and delete. |
| backend/src/controllers/dashboardController.js | Uses Prisma count queries for dashboard totals. |
| backend/db/seed.js | Creates the initial admin user when the seed command is run. |

The schema currently defines two models but no relation fields between them. A Prisma relation would explicitly connect records in different models, such as a user to incidents they created; that relation is not represented in the current schema.

## 12. Authentication, JWT, middleware, cookies, and sessions

**Topic:** Authentication checks who a user is. A JWT is a signed token carrying identity data. A cookie lets a browser send the token with later requests. Middleware can check the token before a protected route runs. A server-side session instead stores session state on the server; ResQGrid currently uses JWT in a cookie, not a session store.

| File or folder | Role in this topic |
| --- | --- |
| backend/src/controllers/authController.js | Looks up the user, checks the bcrypt password hash, signs a JWT, and sets or clears the cookie. |
| backend/src/routes/auth.js | Defines login, logout, and current-user routes. |
| backend/src/middleware/authenticate.js | Reads and verifies the token cookie and attaches identity data to req.user. |
| backend/src/routes/incidents.js | Requires authentication for all incident endpoints. |
| backend/src/routes/dashboard.js | Requires authentication before returning dashboard statistics. |
| backend/src/routes/users.js | Requires authentication before creating a user. |
| backend/src/app.js | Configures cookie parsing and credentialed CORS. |
| backend/src/config/env.js | Reads the JWT secret, expiry, and frontend origin. |
| backend/prisma/schema.prisma | Stores the bcrypt hash in User.passwordHash; it does not store a plain password. |

Login flow: validated email/password → user lookup → bcrypt comparison → JWT signed → token cookie set. Protected request flow: browser sends cookie → authenticate verifies token → route/controller runs.

## 13. File and folder map

    backend/
    ├── src/
    │   ├── server.js                 Node process and HTTP listener
    │   ├── app.js                    Express app, middleware, route mounting
    │   ├── config/                   Environment and application configuration
    │   ├── routes/                   HTTP paths and methods
    │   ├── middleware/               Request parsing/checking/logging/error handling
    │   ├── controllers/              Request and response handling
    │   ├── validators/               Request body rules
    │   ├── models/                   Prisma-backed database operations
    │   ├── db/                       Shared Prisma client and pool setup
    │   ├── services/                 Business logic files (currently not used by routes)
    │   └── utils/                    Shared helpers such as logging
    ├── prisma/
    │   └── schema.prisma             Database model definitions
    ├── prisma7.config.ts             Prisma command-line configuration
    └── db/seed.js                    Initial administrator seed script

## Note about inactive files

backend/src/services/incidentService.js and backend/src/config/hazardMap.js / severityMaps.js exist, but the active routes and controllers do not import them. The current incident flow is route → controller → incidentModel.js → Prisma. Treat the service and mapping files as inactive unless they are connected to the request flow later.
