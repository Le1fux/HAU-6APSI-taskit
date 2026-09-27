# Weekly Increment Report

## Week of: September 21–27, 2026

## What changed this week

- Rename the backend `sightings` resource to TaskIt's actual `materials` resource.
- Replace the `sightings` database table with the `materials` table using the fields `id`, `title`, `content`, and `uploaded_at`.
- Remove the unused `spookiness` field.
- Rename `server/sightingsRepo.js` to `server/materialsRepo.js` while preserving the repository functions `getAll`, `getById`, `create`, `update`, and `remove`.
- Change the API routes from `/api/sightings` to `/api/materials`.
- Update server-side validation to require a non-empty `title` and accept `content` as a string.
- Replace the old sightings seed data with three sample study materials.
- Update `server/.env.example` to use the `taskit` PostgreSQL database instead of `haunted`.
- Update `README.md` by removing the duplicate questions bullet and merging its useful details into the existing materials/questions documentation.

## Why

The original backend still used the template's `sightings` resource, which did not match TaskIt's purpose as a study materials and practice quiz application. The backend schema, repository, API routes, validation, seed data, and environment configuration were updated so they consistently represent TaskIt's actual materials resource. The README cleanup was done to remove duplicated documentation and make the known-issues section clearer.

## What broke or what I got stuck on

The original backend resource was based on the template's `sightings` model, so changing it required updating multiple connected parts rather than simply renaming one file or route. The database schema, seed data, repository queries, server validation, API routes, and example database configuration all had to agree on the new `materials` shape.

The questions resource has not yet been implemented, and `QuizPage.jsx` still uses hardcoded questions. The planned quiz-state architecture is not complete: quiz state is still local rather than lifting `score` and `missedIds` to `App`. Access control is not implemented, the design tokens still need reconciliation, and desktop and mobile screenshots still need to be added. These issues were not fixed in this increment.

The backend refactor was reviewed with `git diff` before committing. No commit had been created at the time of that review, and the current repository state still shows the refactor and README documentation cleanup as uncommitted worktree changes.

## What is left

- Implement the questions resource and API if still unfinished.
- Connect quiz questions to materials instead of relying on hardcoded questions.
- Complete the planned quiz-state and missed-question tracking.
- Address access control before using a publicly reachable database.
- Reconcile the documented design tokens with the Tailwind configuration.
- Add desktop and mobile screenshots.
- Perform final frontend/backend integration testing.
