# Security Checklist - TaskIt

Audit basis: current repository source, local Git metadata, and an anonymous HTTP request to the public GitHub repository page. No hosted database, production environment, GitHub security settings, or recent Actions logs were available for inspection. `Yes`, `No`, and `N/A` below describe the evidence that was actually available; unknown external checks are not marked Yes.

## Secrets and credentials

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 1 | `.env` is gitignored and not tracked | Yes | `.gitignore` ignores `.env`; tracked env paths are `.env.example` files. A local client env file is ignored. |
| 2 | Committed `.env.example` files contain placeholders, not live credentials | Yes | Root, client, and server examples use local/example values and variables; none is a production credential. |
| 3 | No live connection string, key, token, or password is hardcoded in current source | Yes | Source and workflow inspection found example DB credentials and `${POSTGRES_PASSWORD}` interpolation, not live credentials. |
| 4 | Git history was checked for obvious committed credentials | Yes | History and high-signal token/private-key patterns were searched; matches were example URLs or Compose variable interpolation. This is not a substitute for GitHub secret scanning. |
| 5 | Any committed live credential has been rotated | N/A | No live credential was found in the checked history, so there was none to rotate. |
| 6 | Production credentials are stored only in hosting environment settings | N/A | No production API/database host or its settings are part of this local repository audit. |

## GitHub Actions

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 7 | Workflow YAML contains no literal secret value | Yes | The Pages workflow reads only public build variables; no secret value is written in YAML. |
| 8 | Private credentials are stored as Actions secrets and read with `secrets.NAME` | N/A | The current Pages build does not need a private credential; its `VITE_` values are public client configuration. |
| 9 | No workflow step prints secrets and a recent Actions log was checked | No | Workflow source does not echo secrets, but no recent remote Actions log was available to inspect. |
| 10 | Uploaded build artifact excludes `.env` and key files | Yes | The workflow uploads only `client/dist`; no env file is tracked or copied into the client bundle as a secret. Vite variables are public. |
| 11 | Third-party actions are pinned to commit SHAs | Yes | All `uses:` references in the current workflow use full commit SHAs. |
| 12 | GitHub secret scanning and push protection are enabled | No | These are remote repository settings and were not verified; confirm in GitHub Settings before submission. |

## Database and API

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 13 | User values in SQL are parameterized | Yes | `server/materialsRepo.js` passes IDs, titles, and content as query parameters. |
| 14 | A deployed database is restricted to the application or otherwise not public | N/A | No deployed database was available to inspect. Compose does not publish its PostgreSQL port to the host. |
| 15 | The database user has least-required privileges | No | Compose connects as the PostgreSQL `postgres` superuser; no separate least-privilege application role is configured. |
| 16 | Seed/sample data is synthetic | Yes | `server/db/seed.sql` and the client mock use generic study examples, not real people’s data. |
| 17 | Debug, seed, and reset HTTP routes are absent | Yes | `server/server.js` has health/readiness and materials routes only; schema/seed/reset are npm scripts, not HTTP endpoints. |

## Access control

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 18 | The application has an access layer | No | No login, app password, or Zero Trust gate is implemented. |
| 19 | Supabase/Firebase Row Level Security is tested signed out | N/A | The project uses PostgreSQL directly, not Supabase or Firebase. |
| 20 | A selected access gate is configured for the grader | N/A | No access gate has been selected or configured. |
| 21 | Every data-changing route is protected by the gate | No | There is no gate protecting API or frontend routes. |
| 22 | Gate credentials are environment variables, not source | N/A | There are no gate credentials because no gate exists. |

## Input and output

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 23 | Server validates user input | Yes | `server/server.js` requires a non-empty title and caps title at 200 characters and content at 10,000. |
| 24 | User-supplied text is escaped when rendered | Yes | Client source renders values as React text; no `dangerouslySetInnerHTML` use was found. |
| 25 | Error responses avoid exposing stack traces or connection details | Yes | Express logs server errors and returns a generic HTTP 500 JSON message; readiness returns a generic 503 body. |
| 26 | CORS is not configured as a wildcard for data-changing routes | Yes | Express uses a configured origin list; local and Compose examples specify `http://localhost:5173`. Production origins were not inspected. |

## Repository and privacy

| # | Check | Answer | Evidence |
|---:|---|---|---|
| 27 | No student number or personal contact details exist in current files or commits | No | Current docs omit the personal fields, but public commit `b805f46` contains the student's name, number, and school email. History was not rewritten, as instructed. |
| 28 | No classmates' personal data is present | Yes | No classmates' names or contact details were found in current project content; sample material is synthetic. |
| 29 | Dependencies use the official npm registry and `node_modules` is ignored | Yes | Lockfiles resolve from `registry.npmjs.org`; `.gitignore` excludes `node_modules/`. Offline production-dependency audit reported zero vulnerabilities; dev dependencies were not included in that audit. |
| 30 | Images/fonts are owned, licensed, or credited | N/A | No image or font assets are present; the CSS uses system font fallbacks. |
| 31 | Repository visibility is deliberate and was checked | Yes | An anonymous request to the repository page returned HTTP 200, confirming it is publicly accessible. |

## Follow-up

The main outstanding security items are access control, a least-privilege database
role, confirmation of GitHub secret-scanning settings and Actions logs, and a
decision about personal information already present in public Git history. This
history must not be rewritten as part of this task. The database/API setup and
security behavior have not been tested against a live PostgreSQL instance in
this environment.
