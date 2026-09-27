# Security Checklist — TaskIt

## Secrets and credentials

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 1 | .env is gitignored and not in the repository | Yes | .gitignore includes .env; only .env.example is committed |
| 2 | A .env.example with placeholder values only is committed | Yes | .env.example contains only VITE_USE_MOCK_API and VITE_API_BASE_URL with a localhost example, no real values |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | [verify] | Check server/ files manually for hardcoded secrets |
| 4 | Git history is clean: searched git log -p for password, secret, api key, postgres:// | [verify] | Run: git log -p \| grep -i -E "password\|secret\|api[_-]?key\|postgres://" and record the result here |
| 5 | Any credential that was ever committed has been rotated | N/A | None found committed, so nothing to rotate |
| 6 | Production credentials live only in the hosting provider's environment settings | N/A | Not deployed yet — no production environment exists |

## GitHub Actions

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 7 | No secret value is written literally in any workflow YAML | [verify] | Check .github/workflows/ file contents |
| 8 | Secrets are stored in repository Actions secrets and read with ${{ secrets.NAME }} | [verify] | Check workflow contents |
| 9 | No workflow step echoes/dumps a secret; checked a recent run's log | [verify] | Check the Actions tab run history |
| 10 | Uploaded build artifacts contain no .env, key file or generated config | [verify] | Check if the workflow uploads any artifacts |
| 11 | Third-party actions pinned to a commit SHA, not a moveable tag | [verify] | Check the uses: lines in the workflow file |
| 12 | Secret scanning and push protection are enabled | [verify] | Check Settings → Code security on GitHub |

## Database

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | sightingsRepo.js uses $1/$2 parameterized queries throughout |
| 14 | The database is not open to the whole internet, or is reachable only by the app | N/A | No database is deployed yet in this increment |
| 15 | The database user has only the permissions it needs | N/A | No database is deployed yet |
| 16 | Seed and sample data is invented, not real people's data | Yes | Quiz questions in QuizPage.jsx are placeholder/generic text, not real data |
| 17 | Debug, seed and reset routes are removed before going public | [verify] | Check server/ for any test/reset endpoints before final submission |

## Access control

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | No | Not yet implemented — frontend currently runs in demo mode (VITE_USE_MOCK_API=true) with no backend live |
| 19 | If Supabase/Firebase: Row Level Security tested signed out | N/A | Not using Supabase or Firebase |
| 20 | If Zero Trust: grader email on policy. If app password: credentials in private project/README.md | No | Access layer not built yet — planned for before the app takes live traffic |
| 21 | The gate covers every route, including ones that only change data | No | No gate exists yet |
| 22 | The credentials for the gate are environment variables, not in source | N/A | No gate exists yet |

## Input and output

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 23 | Input validated on the server, not only in the browser | No | No server-side validation yet — server/ is not wired to the frontend |
| 24 | User-supplied text is escaped when rendered | [verify] | React escapes text by default unless dangerouslySetInnerHTML is used — confirm it isn't used anywhere |
| 25 | Error responses do not expose stack traces or connection details | [verify] | Not yet applicable to frontend-only build; check once server/ is wired up |
| 26 | CORS is not a wildcard on routes that change data | N/A | No live API yet |

## Repository and privacy

| # | Check | Yes/No/N/A | Evidence |
|---|---|---|---|
| 27 | No student number, personal email, phone number or address in the repository or commits | [verify] | Check AI-USAGE.md, README, and commit messages |
| 28 | No classmate's personal data in the repository | Yes | Solo project, no classmate data involved |
| 29 | Dependencies from official registries, node_modules gitignored | [verify] | Confirm node_modules is in .gitignore |
| 30 | Images, fonts, other assets are mine, licensed, or credited | [verify] | Confirm no unlicensed images are committed under client/ |
| 31 | Repository visibility is deliberate, checked after last push | Yes | Repository set to Public before this submission |

## Anything I found and fixed

This checklist caught that the repository was still Private, which would have blocked grading entirely since the final project and AI-USAGE badge are graded through the public link. It also surfaced that sightingsRepo.js still uses the original course exercise's schema rather than TaskIt's, and that no access gate exists yet since the backend isn't live — both are now tracked as next steps rather than assumed handled.

After creating the file, search the codebase and git history for the [verify] rows above (rows 3, 4, 7-12, 17, 24, 25, 27, 29, 30) and report back what you find for each one, so I can update the Yes/No/N/A values and evidence with real answers instead of placeholders.
