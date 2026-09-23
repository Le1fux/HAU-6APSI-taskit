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

## Backend status

The Express and PostgreSQL backend remains scaffolded separately in `server/`.
The current frontend increment uses local page state and placeholder study data;
API persistence and the final TaskIt database model are the next integration
step. Never commit `.env` files or connection credentials.

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
