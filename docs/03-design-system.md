# TaskIt

## Design system

**Course / Class Code:** 6APSI / 2240
**GitHub:** [Le1fux](https://github.com/Le1fux)

TaskIt's design system is a small set of fixed decisions for the React, Vite,
and Tailwind app. It is based on the four screens in the wireframes: My
Materials, Material Detail, Quiz, and Results.

## Step A: Styling approach

The styling approach is Tailwind CSS. Tokens live in one file and every screen
uses the same classes, which keeps colours, spacing, and type consistent. The
configuration is in `client/tailwind.config.js` and the global directives are in
`client/src/index.css`.

Current token configuration:

```js
// client/tailwind.config.js
colors: {
  primary: '#1D4ED8',
  accent: '#F59E0B',
  bg: '#F7F8FC',
  surface: '#FFFFFF',
  text: '#172033',
},
fontSize: {
  heading: ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
  body: ['1rem', { lineHeight: '1.6' }],
  small: ['0.875rem', { lineHeight: '1.4' }],
},
```

Global styles are loaded from `client/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The page background, text colour, box sizing, selection colour, and form
inheritance are defined once in the base layer.

## Step B: Colour tokens

Each colour has one primary job. Blue marks actions, links, progress, and active
navigation. Amber highlights the main creation action. The neutral tokens define
the page, cards, and text.

| Token | Tailwind name | Role | Hex | Example classes |
| --- | --- | --- | --- | --- |
| Primary | `primary` | Links, buttons, active states, progress | `#1D4ED8` | `bg-primary`, `text-primary` |
| Accent | `accent` | Main call-to-action and emphasis | `#F59E0B` | `bg-accent`, `text-accent` |
| Background | `bg` | Page background and muted controls | `#F7F8FC` | `bg-bg` |
| Surface | `surface` | Cards, header, and content panels | `#FFFFFF` | `bg-surface` |
| Text | `text` | Headings and body text | `#172033` | `text-text` |

Dark text is used on light backgrounds and surfaces; white text is used on
primary actions. These are design choices, not a completed independent WCAG
contrast audit. Focus rings are defined in the global stylesheet.

## Step C: Type scale

Three named sizes cover the current screens:

| Style | Size | Weight | Used for | Tailwind |
| --- | --- | --- | --- | --- |
| Heading | 2.25rem | Bold | Main screen titles | `text-heading` |
| Body | 1rem | Regular | Paragraphs, lists, and inputs | `text-body` |
| Small | 0.875rem | Regular or bold | Labels, dates, progress text, and metadata | `text-small` |

The interface uses a DM Sans-style sans-serif stack with a system fallback. Body
text is comfortable on phones, and form controls inherit the same readable size.

## Step D: Spacing rule

Spacing uses Tailwind's 4px-based scale. The implementation favors multiples of
8px for visual alignment:

| Purpose | Typical Tailwind values | Use |
| --- | --- | --- |
| Tight | `p-2`, `gap-2` | Related labels, metadata, and compact controls |
| Card | `p-4`, `gap-4` | Card interiors and form fields |
| Screen edge | `px-5`, `lg:px-8` | Responsive page padding |
| Section | `py-10`, `lg:py-14`, `mt-8` | Separation between major sections |

Content containers use responsive maximum widths, cards use stable padding, and
mobile layouts stack instead of relying on fixed widths.

## Step E: Reusable components

| Component | Level | Appears on | Main responsibility |
| --- | --- | --- | --- |
| `Header` | Organism | All screens | TaskIt logo and My Materials navigation |
| Material card | Repeated layout | My Materials | Shows material title, content excerpt, and uploaded date |
| Material detail panel | Page section | Material Detail | Displays stored material title and content |
| Practice question row | Hardcoded layout | Material Detail | Displays one generic placeholder question |
| Quiz question card | Page section | Quiz | Shows a hardcoded question, generic answer reveal, and self-grade controls |
| Progress bar | Page element | Quiz | Shows position within the hardcoded three-question set |
| Result panel | Page section | Results | Currently shows fixed sample score and feedback |
| Attempt history rows | Placeholder layout | Results | Displays fixed sample attempt values, not saved attempts |

Buttons and links include hover transitions and visible focus states. Cards use
rounded corners, a white surface, a light border, and the shared soft shadow.

## Step F: Responsive plan

The layout is phone-first. Unprefixed Tailwind classes define the phone layout;
`sm:` and `md:` classes add width and column changes for larger screens.

| Element | Phone | Desktop | Implementation |
| --- | --- | --- | --- |
| Navigation | Compact logo and link row | Wider header with content max-width | `flex`, responsive padding |
| Page content | One column with 20px edge padding | Centred with a maximum width | `max-w-*`, `mx-auto`, `px-5`, `lg:px-8` |
| Forms | Fields stack and buttons expand | Form controls can sit in a row | `flex-col`, `sm:flex-row` |
| Material cards | One column | Two-column grid | `grid`, `md:grid-cols-2` |
| Quiz | Single question column | Centred readable card | `max-w-3xl`, responsive padding |
| Results | Score and review sections stack | Missed questions and history share a grid | `md:grid-cols-[1.2fr_0.8fr]` |

Nothing relies on fixed pixel widths. Content uses full-width or max-width
constraints, text can wrap, and controls remain usable at phone sizes.

## Accessibility checklist and verification status

| Requirement | How TaskIt implements it | How to check it |
| --- | --- | --- |
| Contrast | Dark text is used on light surfaces; primary actions use white labels. | Measure the rendered pairs with a WCAG contrast checker; this has not been recorded as complete. |
| Semantic HTML | Uses `header`, `nav`, `main`, headings, links, forms, buttons, and lists. | Inspect the rendered markup. |
| Labels | Form controls have associated labels or accessible placeholder context. | Activate each label and confirm the field receives focus. |
| Keyboard navigation | Navigation and quiz actions use native links and buttons. | Complete and record the route flow without a mouse; not yet documented as tested. |
| Visible focus | Global `:focus-visible` styling provides a clear outline. | Tab through and record every interactive control; not yet documented as tested. |
| Not colour alone | Quiz grading uses text labels such as `Got it` and `Needs more practice`, not colour alone. | Review the screens in greyscale. |
| Responsive content | Layouts stack and text wraps at narrow widths. | Check the app at 375px and desktop widths. |

## Implementation status

The current scaffold implements the shared Header, responsive Tailwind layout,
materials, material detail, quiz, and results screens. The design system is
implemented in `client/tailwind.config.js`, `client/src/index.css`, and
`client/postcss.config.js`.

Future iterations still need question editing and deletion, persistent mock data
or an always-available API, complete quiz loading/error states, a collapsible
mobile menu if required by the final design, manual accessibility verification,
and screenshot exports for `docs/assets/`.
