# ResQGrid

## Disaster Intelligence & Emergency Response Platform
A lightweight disaster monitoring and emergency response management platform.
ResQGrid helps authorities monitor disasters, track incidents, and coordinate emergency responses through a centralized admin dashboard.

# Our Goal

Build a simple, fast, and lightweight platform that helps disaster management authorities make informed decisions.

# Features

* Incident Management: Track incidents, severity, and status.
* Resource Management: Monitor and coordinate available resources.
* Alerts: Display important warnings and updates.


# Version 1
Backend: basic Express server with REST APIs.
Database: PostgreSQL to store incidents and resources.
Frontend: Simple admin dashboard using React.
Map: Displaying incidents stored in the database.
Alerts: Generating basic warnings based on incident severity.

## Backend technologies used

- **Node.js** runs the backend JavaScript.
- **Express** receives HTTP requests and defines the API routes.
- **PostgreSQL** stores user and incident data.
- **Prisma 7** describes database models and runs database queries.
- **pg** provides the PostgreSQL connection pool used by Prisma's adapter.
- **bcrypt** hashes passwords and checks login passwords against saved hashes.
- **jsonwebtoken (JWT)** creates and verifies login tokens.
- **cookie-parser** reads the login cookie in Express.
- **cors** allows the configured frontend to call the backend and send cookies.
- **helmet** adds security-related HTTP headers.
- **dotenv** loads backend environment settings from `.env`.
- **nodemon** restarts the backend automatically during development.
