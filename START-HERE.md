# Start here

This file is a short entry point for a fresh TaskIt checkout. For the complete
setup, API reference, screenshots status, and known limitations, see
[README.md](README.md).

## Client-only demo

Requires Node.js 20.6 or newer and npm. From the repository root, run:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`. The default mock API supplies sample materials in
memory. Newly created mock materials do not persist after a full page reload.

## Full local stack

A PostgreSQL database named `taskit` must be running. See the README for database
creation, environment setup, schema/seed, the optional Docker Compose path, and
API details. The server and client are installed and run from separate folders;
there is no root `package.json`.

Current API URLs are `http://localhost:3000/healthz`,
`http://localhost:3000/readyz`, and `/api/materials`. The live client requires
`VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000` in
`client/.env`.

## Project status

Materials list/create and materials API CRUD are implemented in source. The form
currently accepts only a title. Practice questions remain hardcoded, question
CRUD is not implemented, and Results still displays fixed placeholder data.
See the README's Known issues section for the current status.
