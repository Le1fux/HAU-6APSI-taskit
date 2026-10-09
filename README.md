# TaskIt

TaskIt is a study-materials and practice-quiz application for college students. It is intended to make exam review easier by organizing a student's notes in one place and giving them a route toward self-testing instead of rereading alone.

## Intended user and problem

TaskIt is for a college student who wants to review their own class notes before an exam without manually rebuilding every note as flashcards. The current increment establishes the materials workflow and the visual structure for practice; question authoring and saved quiz attempts remain future work.

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
| `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` | Optional local access gate; required together, and required in production | Set as protected host environment variables. Do not commit credentials. |
| `PORT` | API runtime | Optional; defaults to `3000`. Do not set it in the local example unless you need a different port. |
| `client/.env` - `VITE_USE_MOCK_API` | Client data source, compiled at build time | `true` uses the in-memory sample materials; set to exact `false` to call the API. |
| `client/.env` - `VITE_API_BASE_URL` | Client live API mode | `http://localhost:3000`; no trailing slash. Ignored in mock mode. |
| root `.env` - `POSTGRES_PASSWORD` | Optional Docker Compose setup | Local-only PostgreSQL password; replace the example before starting Compose. |
| root `.env` - `CORS_ORIGINS` | Optional Docker Compose setup | `http://localhost:5173`. |

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

To use the API, edit `client/.env` and set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000`. Then run:

```powershell
npm run dev
```

Open `http://localhost:5173`. In live mode, the Materials screen should display the seeded records and a newly submitted title should appear after the API creates it. In mock mode, two sample records are provided in memory; locally created records disappear on a full page reload. The mock mode does not use PostgreSQL.

For the client alone, leave `VITE_USE_MOCK_API=true`; no server or database is needed.

## Optional Docker Compose setup

From the repository root, copy the root example, replace its placeholder password, and start the services:

```powershell
Copy-Item .env.example .env
# Edit .env and replace POSTGRES_PASSWORD before starting services.
docker compose up --build -d
```

Compose creates database `taskit`, mounts the schema and seed scripts for first-time initialization of a new data volume, and exposes the API on `http://localhost:3000`. PostgreSQL is only reachable within the Compose network. Initialization scripts run only when the database volume is empty; later starts do not reapply the seed. The root `.env` is ignored by Git. Docker Compose was not available for verification in this environment.

## Implemented features and limitations

**Implemented:** four React Router screens; responsive Tailwind layout; materials list loading; title-only material creation; material detail loading; mock/live API selection; server-side material and ID validation; optional HTTP Basic access gate; PostgreSQL materials schema; and materials CRUD route implementations.

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
server/.dockerignore     excludes local env and dependency files from image builds
project/                 M8A4 report and security checklist
docs/                    proposal, mockup, design, journals, reports
  assets/README.md       screenshot capture checklist; no screenshots yet
```

## Screenshots

No application screenshots are currently present. Do not treat the wireframe or this README as screenshot evidence. Before submission, capture actual running screens and add them under `docs/assets/`:

- Materials screen with sample materials and its title-only create form.
- Material Detail screen showing stored material content and the current hardcoded question list.
- Quiz screen with the revealed-answer state and self-grading controls.
- Results screen, clearly showing that its current score/history are placeholders.
- At least one phone-width capture if the submission requires mobile evidence.

See [`docs/assets/README.md`](docs/assets/README.md) for the capture checklist.

## Known issues and next steps

1. Add a content field to the Materials form and decide whether mock data should persist across reloads.
2. Implement question CRUD and connect questions to a material.
3. Lift or persist quiz attempt state so Results reflects the actual score and missed questions.
4. Configure `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` on the production host before exposing private student material through a public API.
5. Capture real desktop and mobile screenshots and verify keyboard access, responsive layouts, and contrast.
6. Run a full local PostgreSQL/API/client integration test; it has not been verified as part of this update.

## AI assistance

AI assistance was used during project setup, frontend scaffolding, and documentation work; this is also recorded in [`AI-USAGE.md`](AI-USAGE.md). The detailed usage log is incomplete and still needs the author's verified entries and attribution before final submission.

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)
