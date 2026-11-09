# StudyLens
StudyLens is a general PDF reviewer that creates focused, source-grounded study guides with specific findings, key terms, page citations, supporting excerpts, and up to 30 practice questions when the uploaded material supports them. Library cards provide a direct link to each full summary. Its built-in library includes an introductory Philippine CPA Licensure Examination (CPALE) reviewer with topic outlines and practice across all six subjects, plus Accounting, Economics, and business fundamentals samples. Each sample has its own class-based module, with shared reviewer behavior and a focused-reviewer subclass for subject excerpts. Course or subject context is optional and helps focus PDF analysis; automatic web search is not available, and AI analysis uses the uploaded PDF as its only source.

## Intended user and problem

StudyLens is for learners who want to prepare rigorously and verify study takeaways against source documents. The built-in CPALE reviewer is an independent study aid with 48 questions across six subjects, including scenario-based multiple-choice questions with worked rationales and expanded Philippine tax and business-law coverage. It is not an official PRC/BOA publication, a complete syllabus, or a guarantee of passing. Verify exam coverage, current statutes, BIR issuances, and Philippine-adopted standards with official sources. The Accounting and Economics samples are focused excerpts from the linked OpenStax chapters. AI-powered analysis requires the server API and an Anthropic API key; the default local mode generates a text-based reviewer with a more varied extractive summary.

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

## Step-by-step setup (PowerShell)

Start with the client in mock mode. This is the quickest way to run the app and does not require the API, PostgreSQL, or an API key.

### 1. Clone the project

For a fresh clone, open PowerShell in the **parent folder** where you want the project created. For example, to create `C:\Users\USER\Documents\StudyLens`, start in `C:\Users\USER\Documents` (not inside an existing `StudyLens` folder):

```powershell
git clone https://github.com/Le1fux/StudyLens.git StudyLens
Set-Location .\StudyLens
```

If you already have this project open in `C:\Users\USER\Documents\StudyLens`, skip the clone commands and continue from that folder; `Set-Location .\StudyLens` would look for a nested `StudyLens` folder.

### 2. Install and start the client

In the same terminal, run:

```powershell
Set-Location .\client
npm install
Copy-Item .env.example .env
npm run dev
```

After Vite starts, open the app in your default browser from a **second PowerShell terminal**:

```powershell
Start-Process http://localhost:5173
```

The client starts in mock mode and includes the built-in CPALE, Accounting, Economics, and business fundamentals samples. PDF review uses a local text-based heuristic, and uploaded records are not retained after a full page reload.

### 3. (Optional) Install and configure the API

Skip this step if you only need the mock client. For AI-powered PDF analysis or database features, open a **new PowerShell terminal** in the project folder and run:

```powershell
Set-Location .\server
npm install
Copy-Item .env.example .env
notepad .env
```

In `server/.env`, set `CORS_ORIGINS=http://localhost:5173`. For AI-powered analysis, add your Anthropic key to `ANTHROPIC_API_KEY`. Keep the key in this ignored server file; never put it in a client `VITE_` variable. If you are not setting up PostgreSQL, clear the example `DATABASE_URL` value. The API can run without a database for reviewer and health routes.

### 4. (Optional) Set up PostgreSQL for database features

Skip this step if you only need PDF review. Start PostgreSQL. In the server terminal, create the `taskit` database:

```powershell
createdb taskit
```

If `createdb` is unavailable, connect to PostgreSQL with an administrator and run `CREATE DATABASE taskit;` once. Set `DATABASE_URL` in `server/.env` to your database connection string, for example `postgresql://<username>:<password>@localhost:5432/taskit`. Replace the placeholders with your local credentials.

Initialize the database from the `server` directory:

```powershell
npm run db:reset
```

This runs the schema and seed scripts. **It clears the `materials` table**, so use it only with a development database that you are willing to reset.

### 5. Start the API

If you completed step 3, start the API in the server terminal:

```powershell
npm run dev
```

The API listens at `http://localhost:3000`. To open its health check in your default browser from another PowerShell terminal, run:

```powershell
Start-Process http://localhost:3000/healthz
```

The `/readyz` endpoint checks database connectivity and therefore requires PostgreSQL.

### 6. (Optional) Connect the client to the API

Stop the client dev server with `Ctrl+C`. The first terminal is still in the `client` directory; edit its environment file:

```powershell
notepad .env
```

Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000`, save the file, then restart Vite:

```powershell
npm run dev
```

The browser client now uses the API. AI-powered PDF analysis requires the server and an Anthropic API key; it supports up to 30 PDF pages and 15,000 extracted characters. Enter a course or subject when it helps focus the analysis. Built-in samples are available in both mock and live modes.

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
| `client/.env` - `VITE_USE_MOCK_API` | Client data source, compiled at build time | `true` uses the in-memory reviewer library; set to exact `false` to call the API. All four built-in samples are included in either mode. |
| `client/.env` - `VITE_API_BASE_URL` | Client live API mode | `http://localhost:3000`; no trailing slash. Ignored in mock mode. |
| root `.env` - `POSTGRES_PASSWORD` | Optional Docker Compose setup | Local-only PostgreSQL password; replace the example before starting Compose. |
| root `.env` - `CORS_ORIGINS` | Optional Docker Compose setup | `http://localhost:5173`. |
| root `.env` - `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` | Docker Compose access gate | Replace both local placeholders before starting Compose. |

Copy each relevant `.env.example` to `.env` in the same directory. The client variables are public build-time values; never put passwords, keys, or connection strings in any `VITE_` variable. Real credentials belong only in ignored local `.env` files or the hosting provider's protected environment settings.

## Optional Docker Compose setup

From the repository root, copy the root example, replace the database and access-gate placeholders, and start the services:

```powershell
Copy-Item .env.example .env
# Edit .env and replace POSTGRES_PASSWORD and the Basic Auth credentials.
docker compose up --build -d
```

Compose creates database `taskit`, mounts the schema and seed scripts for first-time initialization of a new data volume, and exposes the API on `http://localhost:3000`. PostgreSQL is only reachable within the Compose network. Initialization scripts run only when the database volume is empty; later starts do not reapply the seed. The root `.env` is ignored by Git. Docker Compose was not available for verification in this environment.

## Implemented features and limitations

**Implemented:** four React Router screens; responsive StudyLens styling; built-in CPALE, Accounting, Economics, and business fundamentals reviewer samples; reviewer list loading; PDF text extraction with page boundaries; local and AI-powered general reviewer modes; source-grounded findings, key terms, and cited questions in AI mode; server-side material and ID validation; optional HTTP Basic access gate; PostgreSQL materials schema; and materials CRUD route implementations.

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
| `POST` | `/api/reviewer` | JSON body `{ "content": "extracted PDF text", "course": "optional course or subject" }`; requires `ANTHROPIC_API_KEY`. Returns a summary, detailed findings, key terms, and practice questions with page numbers and excerpts verified against the submitted text. |

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
  db/seed.sql            clears development materials; starts with an empty library
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
