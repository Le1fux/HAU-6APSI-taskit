# StudyLens
StudyLens turns study PDFs into focused, source-grounded guides with specific findings, key terms, page citations, supporting excerpts, and practice questions. Course or subject context is optional and helps focus the analysis; automatic web search is not available, and AI analysis uses the uploaded PDF as its only source.

## Intended user and problem

StudyLens is for students who want to understand their class material in detail and verify study takeaways against the original PDF. AI-powered analysis requires the server API and an Anthropic API key; the default local demo mode generates a lightweight text-based outline.

## Technology stack

- React 18 and React Router 7 for the client and its four routes.
- Vite 6 for development and production builds.
- Tailwind CSS 3 with PostCSS and Autoprefixer.
- Node.js and Express 4 for the API.
- PostgreSQL with the `pg` Node.js driver.
- Docker Compose is available as an optional local full-stack setup.

There is no root `package.json`. Install and run client and server dependencies from their own directories.

## Requirements

- Git.
- Node.js 20.6 or newer and npm. The server package declares `>=20.6.0` because its scripts use Node's `--env-file` option.
- PostgreSQL 17 or compatible for the local database workflow. PostgreSQL 17 is the version used by `compose.yml`.
- Alternatively, Docker with the Docker Compose plugin can start the database and API services. Docker is not installed in every development environment.

## Clone and install

Run these commands in PowerShell from the directory where you keep projects:

```powershell
git clone https://github.com/Le1fux/HAU-6APSI-taskit.git
cd HAU-6APSI-taskit
```

Install and configure the server from the repository root:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` for your local PostgreSQL username/password and keep its database name as `taskit`. This file is ignored by Git. Do not commit real credentials.

## Database setup

Start your local PostgreSQL service, then create the `taskit` database. With PostgreSQL command-line tools on PATH:

```powershell
createdb taskit
```

If `createdb` is unavailable, connect to PostgreSQL with an administrator and run `CREATE DATABASE taskit;` once. If set, `DATABASE_URL` in `server/.env` must point to that database and use credentials that can create the schema and rows; it is optional, and without it only the reviewer and health routes work.

From the terminal already in `server/`, run the server script. It executes the checked-in SQL files through the Node `pg` driver, so `psql` is not required for schema and seed execution:

```powershell
npm run db:reset
```

`db:reset` runs `db:schema.sql` and then `db:seed.sql`. The seed script truncates and repopulates `materials`; use it only against a development database because it removes existing material rows.

## Environment variables

| File / variable | Required for | Example or behavior |
| --- | --- | --- |
| `server/.env` - `DATABASE_URL` | Optional for database routes and scripts | `postgresql://postgres:devpassword@localhost:5432/taskit`; replace username/password for your machine. Without it, only the reviewer and health routes work. |
| `server/.env` - `CORS_ORIGINS` | API requests from browsers | `http://localhost:5173`; comma-separated origins, no path or trailing slash. |
| `server/.env` - `NODE_ENV` | API runtime | `development` locally; set `production` in a production host's environment. |
| `server/.env` - `ANTHROPIC_API_KEY` | AI-powered PDF analysis | Set your key in the server's ignored `.env` file or protected host settings. Never put it in a `VITE_` variable. |
| `server/.env` - `ANTHROPIC_MODEL` | AI-powered PDF analysis | Optional; defaults to `claude-haiku-4-5-20251001`. |
| `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` | Optional local access gate; required together, and required in production | Set as protected host environment variables. Do not commit credentials. |
| `PORT` | API runtime | Optional; defaults to `3000`. Do not set it in the local example unless you need a different port. |
| `client/.env` - `VITE_USE_MOCK_API` | Client data source, compiled at build time | `true` uses the in-memory sample materials; set to exact `false` to call the API. |
| `client/.env` - `VITE_API_BASE_URL` | Client live API mode | `http://localhost:3000`; no trailing slash. Ignored in mock mode. |
| root `.env` - `POSTGRES_PASSWORD` | Optional Docker Compose setup | Local-only PostgreSQL password; replace the example before starting Compose. |
| root `.env` - `CORS_ORIGINS` | Optional Docker Compose setup | `http://localhost:5173`. |
| root `.env` - `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` | Docker Compose access gate | Replace both local placeholders before starting Compose. |

Copy each relevant `.env.example` to `.env` in the same directory. The client variables are public build-time values; never put passwords, keys, or connection strings in any `VITE_` variable. Real credentials belong only in ignored local `.env` files or the hosting provider's protected environment settings.

## Run the full application

Use two PowerShell terminals after completing the database setup.

**Terminal 1: start the API**

Open a new PowerShell terminal in the directory that contains the cloned
`HAU-6APSI-taskit` folder, then run:

```powershell
cd HAU-6APSI-taskit\server
npm run dev
```

The API listens at `http://localhost:3000` by default. Check process health at `http://localhost:3000/healthz` and database readiness at `http://localhost:3000/readyz`; the ready endpoint requires PostgreSQL to be running.

**Terminal 2: configure and start the client**

Open another PowerShell terminal in that same parent directory:

```powershell
cd HAU-6APSI-taskit\client
npm install
Copy-Item .env.example .env
```

For detailed AI analysis, add your Anthropic API key to `server/.env`, then edit `client/.env` and set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000`. The server analyzes up to 30 PDF pages and 15,000 extracted characters. Then run:

```powershell
npm run dev
```

Open `http://localhost:5173`. In live mode, PDF findings, key terms, and practice questions include page references and supporting excerpts. In mock mode, two sample records are provided in memory and PDF analysis uses a lightweight local text heuristic; locally created records disappear on a full page reload. The mock mode does not use PostgreSQL or AI.

For the client alone, leave `VITE_USE_MOCK_API=true`; no server or database is needed.

## Optional Docker Compose setup

From the repository root, copy the root example, replace the database and access-gate placeholders, and start the services:

```powershell
Copy-Item .env.example .env
# Edit .env and replace POSTGRES_PASSWORD and the Basic Auth credentials.
docker compose up --build -d
```

Compose creates database `taskit`, mounts the schema and seed scripts for first-time initialization of a new data volume, and exposes the API on `http://localhost:3000`. PostgreSQL is only reachable within the Compose network. Initialization scripts run only when the database volume is empty; later starts do not reapply the seed. The root `.env` is ignored by Git. Docker Compose was not available for verification in this environment.

## Implemented features and limitations

**Implemented:** four React Router screens; responsive StudyLens styling; materials list loading; PDF text extraction with page boundaries; local and AI-powered reviewer modes; source-grounded findings, key terms, and cited questions in AI mode; server-side material and ID validation; optional HTTP Basic access gate; PostgreSQL materials schema; and materials CRUD route implementations.

**Partial or mock-only:** the mock material store exists only in JavaScript memory, not localStorage. The Materials form sends empty content because it has no content editor. Material detail displays three generic hardcoded practice questions. Quiz uses hardcoded questions and a generic revealed answer; its index, revealed state, and score stay local to that page. Results displays fixed sample score, missed-question, and attempt-history content, not data from the latest quiz.

**Not implemented:** question create/read/update/delete API or UI, question persistence, dynamic quiz results and missed-question tracking, saved attempt history, and production deployment/configuration of the API/database and access gate.

## API reference

All API routes are defined in `server/server.js`. Database values are passed as parameters in `server/materialsRepo.js`.

| Method | Path | Purpose and response |
| --- | --- | --- |
| `GET` | `/healthz` | Process liveness; returns `{ "ok": true }`. |
| `GET` | `/readyz` | Checks database connectivity; returns `{ "ok": true, "db": "up" }` or HTTP 503 when unavailable. |
| `GET` | `/api/materials` | Returns material rows ordered by `uploaded_at` descending. |
| `GET` | `/api/materials/:id` | Returns one material, HTTP 400 for an invalid ID, or HTTP 404. |
| `POST` | `/api/materials` | JSON body `{ "title": "...", "content": "..." }`; returns HTTP 201 and the inserted row. Title is required, max 200 characters; content max 10,000 characters. |
| `PUT` | `/api/materials/:id` | JSON body with `title` and `content`; returns the updated row, HTTP 400 for an invalid ID, or HTTP 404. Uses the same validation as POST. |
| `DELETE` | `/api/materials/:id` | Deletes a material; returns HTTP 204, HTTP 400 for an invalid ID, or HTTP 404. |
| `POST` | `/api/reviewer` | JSON body `{ "content": "extracted PDF text", "course": "optional course name" }`; requires `ANTHROPIC_API_KEY`. Returns a summary, detailed findings, key terms, and practice questions with page numbers and excerpts verified against the submitted text. |

No questions API currently exists. The API's default error middleware logs server details and returns a generic HTTP 500 response.

## Project structure

```text
client/                  React/Vite frontend
  src/api/materials.js   Mock/live materials API adapter
  src/components/        Shared header
  src/pages/             Materials, detail, quiz, and results screens
  src/App.jsx            Route definitions
  src/main.jsx           React and BrowserRouter entry
  .env.example           Client build-time settings
server/                  Express/PostgreSQL API
  db/schema.sql          materials table and index
  db/seed.sql            development materials; truncates before seeding
  db/run.js              executes SQL through pg
  db/pool.js             PostgreSQL pool configuration
  materialsRepo.js       parameterized materials CRUD
  server.js              health, readiness, and materials endpoints
compose.yml              optional PostgreSQL and API services
.env.example             local Compose placeholders; copy to ignored root .env
.dockerignore            excludes local env, dependencies, and build output from image context
docs/                    weekly project log
project/REPORT.md         project increment report
```

## Screenshots

No application screenshots are currently included.

## Known issues and next steps

1. Add a content field to the Materials form and decide whether mock data should persist across reloads.
2. Implement question CRUD and connect questions to a material.
3. Lift or persist quiz attempt state so Results reflects the actual score and missed questions.
4. Configure `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` on the production host before exposing private student material through a public API.
5. Verify keyboard access, responsive layouts, and contrast.
6. Run a full local PostgreSQL/API/client integration test; it has not been verified as part of this update.
