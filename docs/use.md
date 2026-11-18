# ResQGrid — How to Use

## Prerequisites

Make sure you have these installed:
- **Node.js** v18 or higher
- **PostgreSQL** (with pgAdmin or CLI)
- **npm**

---

## First-Time Setup

### 1. Create the database (pgAdmin or terminal)

In pgAdmin: right-click **Databases → Create → Database**, name it `resqgrid`.

Or in terminal:
```bash
psql -U postgres -c "CREATE DATABASE resqgrid;"
```

### 2. Configure environment

The `.env` file is already in `backend/`. Open it and check the DATABASE_URL matches your postgres setup:

```
backend/.env
```

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/resqgrid
JWT_SECRET=any-long-random-string-here
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN=8h
```

> Change `YOUR_PASSWORD` to your actual postgres password.

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Generate Prisma client + create tables

```bash
cd backend

npx prisma generate    # builds the Prisma client from schema.prisma
npx prisma db push     # creates the tables in your database
```

### 5. Seed the database

```bash
node db/seed.js
```

Output:
```
[seed] ✓ Admin user: admin@resqgrid.local / Admin1234!
[seed] Done ✓
```

---

## Running the App

You need **two terminals** — one for backend, one for frontend.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Expected output:
```
[server] ResQGrid API running on http://localhost:4000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE ready in xxx ms
  ➜  Local: http://localhost:5173/
```

### Open in browser

```
http://localhost:5173
```

Login with:
- **Email:** `admin@resqgrid.local`
- **Password:** `Admin1234!`

### Testing the "Create User" feature
1. In the sidebar, click **"👤 Create User"** (or visit `/users/new`).
2. Fill in the form:
   - **Name:** e.g., `Test User`
   - **Email:** e.g., `user@resqgrid.local`
   - **Password:** at least 8 characters (e.g., `User1234!`)
3. Click **Create User**. The password is encrypted with `bcrypt` before writing to PostgreSQL.
4. Click **Logout** in the top bar.
5. Log in with your newly created user's email and password!

---

## Daily Use (after setup)

Just run both servers each time:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## Useful Commands

### Backend

| Command | What it does |
|---|---|
| `npm run dev` | Start backend with auto-restart (nodemon) |
| `npm start` | Start backend without auto-restart |
| `npx prisma generate` | Regenerate Prisma client after schema change |
| `npx prisma db push` | Apply schema changes to the database |
| `npx prisma studio` | Open a visual DB browser in your browser |
| `node db/seed.js` | Create the initial admin account only |

### Frontend

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## API Routes (what the backend exposes)

| Method | Route | What it does | Auth? |
|---|---|---|---|
| POST | `/api/auth/login` | Login — sets cookie | No |
| POST | `/api/auth/logout` | Logout — clears cookie | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/dashboard` | Stats (total/active/resolved) | Yes |
| GET | `/api/incidents` | List all incidents | Yes |
| POST | `/api/incidents` | Create a new incident | Yes |
| GET | `/api/incidents/:id` | Get one incident | Yes |
| PUT | `/api/incidents/:id` | Update an incident | Yes |
| DELETE | `/api/incidents/:id` | Delete an incident | Yes |
| POST | `/api/users` | Create a new user (bcrypt hashed) | Yes |
| GET | `/health` | Server alive check | No |

---

## Ports

| Service | Port |
|---|---|
| Frontend (Vite) | 5173 |
| Backend (Express) | 4000 |
| PostgreSQL | 5432 |

---

## Troubleshooting

**"Could not load incidents"**
→ Backend is not running. Start it with `npm run dev` in `backend/`.

**Login fails with 401**
→ Create the initial admin account with `node db/seed.js`.

**`DATABASE_URL` error on start**
→ Check `backend/.env` exists and the password is correct.

**Prisma generate fails**
→ Run `npm install` first, then `npx prisma generate`.

**Port already in use**
→ Something else is on that port. Kill it:
```bash
lsof -ti:4000 | xargs kill   # kill whatever is on port 4000
lsof -ti:5173 | xargs kill   # kill whatever is on port 5173
```
