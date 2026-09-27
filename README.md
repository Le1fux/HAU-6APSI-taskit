# TaskIt

TaskIt is a study workspace that turns learning materials into focused practice.
The current increment is a responsive React frontend scaffold with material
browsing, practice questions, quizzes, and results review.

## Current features

- Create a study material from the materials page.
- Browse recent materials and open a material detail view.
- Review practice questions before starting a quiz.
- Reveal answers, self-grade, and track quiz progress.
- Review scores, missed questions, and attempt history.
- Navigate between all screens with React Router.
- Use responsive layouts for desktop and mobile screens.

## Frontend structure

```text
client/
  src/
    components/
      Header.jsx
    pages/
      MaterialsPage.jsx
      MaterialDetailPage.jsx
      QuizPage.jsx
      ResultsPage.jsx
    App.jsx
    main.jsx
    index.css
  index.html
  tailwind.config.js
  postcss.config.js
  package.json
server/                 Express and PostgreSQL backend scaffold
  db/                   schema, seed, pool, and database runner
  server.js
  sightingsRepo.js
docs/                    proposal, mockup, design, and progress records
```

The route map is:

| Route | Screen |
| --- | --- |
| `/` | Materials |
| `/materials/:id` | Material detail |
| `/materials/:id/quiz` | Quiz |
| `/materials/:id/results` | Results |

## Design system

The frontend uses Tailwind CSS. Design tokens are defined in
`client/tailwind.config.js`:

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#1D4ED8` | navigation, primary actions, progress |
| `accent` | `#F59E0B` | emphasis and creation action |
| `bg` | `#F7F8FC` | page background |
| `surface` | `#FFFFFF` | cards and panels |
| `text` | `#172033` | headings and primary text |

Global Tailwind directives and base rules are in `client/src/index.css`.
The interface uses a light slate background, white surfaces, rounded controls,
visible focus states, and responsive spacing.

## Run locally

From the repository root:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173` in a browser.

To verify the production bundle:

```powershell
cd client
npm run build
```

The build runs Vite and creates `dist/404.html` for GitHub Pages fallback
routing. The generated `dist/` directory is ignored by Git.

## Known issues and next steps

- Backend materials resource is implemented; the questions resource is not.
  The server now has a working `materials` table and full CRUD routes
  (`GET/POST /api/materials`, `GET/PUT/DELETE /api/materials/:id`) backed by
  PostgreSQL, and the frontend's `MaterialsPage` and `MaterialDetailPage` are
  wired to it through `client/src/api/materials.js`, which switches between
  mock and live data via `VITE_USE_MOCK_API`. A `questions` table and its
  routes have not been built yet. The table would contain `id`, `material_id`,
  `question`, and `answer`, related to `materials` by a foreign key. Until
  then, `QuizPage.jsx` uses a hardcoded question list rather than reading from
  a material.
- Quiz state does not yet match the planned architecture. The proposal
  specifies `score` and `missedIds` lifted to `App` so the Results screen can
  read them, with `currentIndex` and `answerRevealed` local to the quiz page.
  The current `QuizPage.jsx` keeps all state local to itself, has no
  `missedIds`, and does not yet track missed questions.
- No access control yet. The app has no login, Cloudflare Zero Trust gate,
  or app-level password in front of it. This needs to be in place before the
  backend is connected to a live, publicly reachable database.
- Design tokens. The committed Tailwind config (`primary: #1D4ED8`,
  `accent: #F59E0B`) doesn't yet match the palette in the Design System doc
  (`primary: #2563EB`, `accent: #15803D`, chosen for verified contrast).
  This is still open — I'll decide and reconcile it in the next pass, rather
  than lock it in now.
- No screenshots are committed yet. Desktop and mobile screenshots will be
  added under `docs/assets/` before final submission.

## Evidence

The implemented screens are documented in [docs/02-mockup.md](docs/02-mockup.md),
and visual tokens are documented in [docs/03-design-system.md](docs/03-design-system.md).
Screenshots for desktop and mobile should be added under `docs/assets/` before
final submission. No screenshot assets are currently committed.

## Progress

The frontend increment was committed and pushed to `origin/main` as
`e64c6bc` (`add React routes and layout`). Build verification passed with
`npm run build` from `client`.

## AI use

AI assistance was used during setup and frontend implementation. See
[AI-USAGE.md](AI-USAGE.md) for the project record.
