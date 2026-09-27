# M8A4 Weekly Increment Report

## Week of: September 21-27, 2026

## What changed this week

- Replaced the template database table with `materials` and the columns `id`, `title`, `content`, and `uploaded_at`, plus a descending `uploaded_at` index.
- Renamed the repository module to `server/materialsRepo.js` and changed the API resource routes to `/api/materials` while retaining parameterized CRUD queries.
- Changed request validation to require a non-empty title, cap titles at 200 characters, and cap content at 10,000 characters.
- Replaced the template seed rows with three synthetic study-material examples.
- Wired the Materials page to load and create materials through the mock/live adapter and wired Material Detail to load a material by ID.
- Reconciled the local database name as `taskit` in the server example and Compose configuration, and configured Compose to initialize schema before seed data.
- Removed obsolete, unreferenced sightings API files from the active frontend cleanup.

## Why

The original backend resource described sightings rather than the study-materials
application in the proposal. Updating the table, repository, routes, validation,
seed data, and client calls together made the current resource shape consistent
across the implementation. The quiz/questions work remains outside this
increment because a question API and persisted attempt model do not exist yet.

## What I got stuck on

The resource rename crossed database, API, frontend, and environment boundaries,
so a partial rename would have left different layers speaking different data
shapes. The existing project also had an unused sightings client adapter beside
the new materials adapter, which made it unclear which path was active until the
page imports were traced.

## Verification status

The client production build passed with `npm run build`. Node syntax checks
passed for `server.js`, `materialsRepo.js`, and `db/run.js`; offline npm audits
reported zero vulnerabilities for both packages. PostgreSQL-backed integration
was not run because PostgreSQL and Docker were unavailable in the environment.
No database behavior is claimed as runtime-verified in this report.

## What is left

- Add a content editor to the Materials form.
- Implement question CRUD and associate questions with materials.
- Connect quiz questions, score, missed questions, and saved attempt history to real state/data.
- Choose and implement access control before exposing a live student-data API.
- Capture real desktop and mobile screenshots and perform final integration and accessibility checks.
