# TaskIt

## App proposal

**Course / Class Code:** 6APSI / 2240
**GitHub:** [Le1fux](https://github.com/Le1fux)

## App name

TaskIt

## What the app is for

TaskIt lets a student organize study materials and turn them into practice
questions for exam review, so they can quiz themselves instead of only
re-reading their notes.

## Who it is for

- A college student who wants a faster way to review their own notes before an
  exam, without rebuilding everything as flashcards by hand.
- A student who wants to either add new study material or jump directly into a
  quiz for material they have already saved.

## Sections and routes

TaskIt is a multi-screen app with four routes:

| # | Section / route | Purpose |
| --- | --- | --- |
| 1 | My Materials (`/`) | Shows saved study materials and lets the user add a new one by entering a title and its text. |
| 2 | Material Detail (`/materials/:id`) | Shows one material's content and practice questions, with space to add, edit, or delete question-and-answer pairs. |
| 3 | Quiz (`/materials/:id/quiz`) | Shows one question at a time, reveals the answer, and lets the user mark themselves right or wrong. |
| 4 | Results (`/materials/:id/results`) | Shows the latest score, missed questions, and saved scores from past attempts on the same material. |

The core routes are My Materials, Material Detail, and Quiz. Without them there
is no material to study, no questions to ask, or no way to practise. Results is
the first route I would reduce if time runs short because the score is already
visible during the quiz and Results mainly adds saved history.

## State and data

The most important screen is Quiz. Its main state is:

| Data | Shape | Owner | Changes when... |
| --- | --- | --- | --- |
| `questions` | `[{ id, materialId, question, answer }]` | App | The user adds, edits, or deletes a question on Material Detail. |
| `currentIndex` | number | QuizPage | The user moves to the next question. |
| `answerRevealed` | boolean | QuizPage | The user reveals the answer; it resets when they move to the next question. |
| `score` | number | App | The user marks a question correct. |
| `missedIds` | `[questionId]` | App | The user marks a question wrong. |

The app also holds materials shaped like `{ id, title, content, uploadedAt }` and
quiz results shaped like `{ id, materialId, score, missedIds }`. Materials are
read by My Materials and Material Detail, while Results reads saved scores and
missed questions.

Questions, score, and missed IDs are shared state because Results needs them after
the quiz ends. When an attempt ends, the score and missed IDs are saved together
as one quiz result. `currentIndex` and `answerRevealed` are only needed while a
quiz is running, so they stay local to QuizPage.

## Quiz screen contents

- **Progress indicator:** material title and position, such as `Question 3 of 12`.
- **Question card:** question text and a `Show Answer` control.
- **Revealed answer:** shown after the user reveals the answer.
- **Self-grading controls:** `I got it right` and `I got it wrong`.
- **Running score:** the current score shown below the question flow.

## Content to gather

- Two or three pages of real notes from one class to use as sample study
  material, since an empty materials screen cannot be tested properly.
- Handwritten question-and-answer pairs for each sample material, so Quiz has
  useful content from the first day of development.
- A simple icon or logo to accompany the TaskIt name.

## Risk and scope decision

The least certain feature is turning material into practice questions. The
simpler option, which fits the planned data model, is for the user to write and
edit question-and-answer pairs on Material Detail. The harder option is
question generation from pasted text, which would require an AI service called
through the backend so its key stays out of the browser.

The initial scope uses user-written questions because it can be finished while
still covering forms, state, routing, and stored data. Generated questions are a
stretch goal and should be revisited after the core workflow and backend are
stable.
