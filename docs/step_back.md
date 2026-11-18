# Backend Setup Notes

These are the backend packages and commands currently used by ResQGrid. The backend uses PostgreSQL.

## Main backend packages

- `express` — HTTP server and API routes.
- `prisma` and `@prisma/client` — database schema and query client.
- `@prisma/adapter-pg` and `pg` — connect Prisma to PostgreSQL through a connection pool.
- `bcrypt` — password hashing and password checks.
- `jsonwebtoken` — signed login tokens.
- `cookie-parser` — reads cookies from incoming requests.
- `cors` — allows the frontend origin to make requests with cookies.
- `helmet` — adds security headers.
- `dotenv` — loads environment variables from `.env`.
- `nodemon` — restarts the backend during development.

The packages are listed in `backend/package.json`. Install them from the backend folder with:

```bash
npm install
```

## Start and prepare the backend

Run these commands from `backend/`:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

`prisma generate` builds the client from `prisma/schema.prisma`. `db push` applies the schema to PostgreSQL. The seed command creates the initial admin if needed. `npm run dev` starts the API using `src/app.js`.

Set `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT`, `NODE_ENV`, `CLIENT_ORIGIN`, and `JWT_EXPIRES_IN` in `backend/.env` before starting the backend.
