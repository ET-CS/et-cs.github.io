# et-cs.github.io

[![CI](https://github.com/ET-CS/et-cs.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/ET-CS/et-cs.github.io/actions/workflows/ci.yml)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Content: CC0](https://img.shields.io/badge/content-CC0-lightgrey.svg)](LICENSE-CONTENT)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg)](https://astro.build)

A small site by Itai Sidney Cohen-Solal, live at **[et-cs.github.io](https://et-cs.github.io)**.

Built with [Astro](https://astro.build): one column of well-set text, a light and dark theme, no client-side framework, and almost no JavaScript.

## Getting started

Requires the Node.js version in [`.node-version`](.node-version), which CI also uses.

```bash
npm ci
npm run dev
```

The site runs at http://localhost:4321.

## Scripts

| Command            | What it does                                             |
| ------------------ | -------------------------------------------------------- |
| `npm run dev`      | Start the dev server with hot reload                     |
| `npm run build`    | Build the production site into `dist/`                   |
| `npm run preview`  | Serve the production build locally                       |
| `npm run check`    | Type-check (`astro check`, TypeScript strictest)         |
| `npm run lint`     | Lint with ESLint (TypeScript, Astro and accessibility)   |
| `npm run format`   | Format everything with Prettier                          |
| `npm test`         | Build a test version of the site and run Playwright      |
| `npm run validate` | Everything CI runs: format, lint, types, build and tests |

The first time you run tests, install the browser: `npx playwright install chromium`.

## Writing a post

Add a Markdown (`.md`) file to [`src/content/blog/`](src/content/blog/). The file name becomes the URL (`hello-world.md` → `/blog/hello-world/`).

```markdown
---
title: 'Hello, world'
description: 'One sentence that summarizes the post.'
pubDate: '2026-11-03'
---

The post, in Markdown.
```

Add `updatedDate` when you revise a post. Put images next to the post and reference them with a relative path, such as `![A line drawing of a mountain.](./mountain.jpg)`; they're optimized at build time. Describe each image in its alt text, or leave the alt text empty if the image is purely decorative.

The schema lives in [`src/content.config.ts`](src/content.config.ts), so a misspelled or unknown frontmatter field fails the build instead of shipping.

## Project structure

```text
public/                Static files served as-is (favicons)
src/
├── components/        Reusable UI components
├── content/blog/      Posts (Markdown)
├── layouts/           Base layout (document head and page chrome) and post layout
├── lib/               Data helpers and shared types
├── pages/             Routes (pages and endpoints)
├── styles/            global.css: design tokens and typography
├── consts.ts          Site-wide settings: URL, title, description, profile links
└── content.config.ts  Post frontmatter schema
tests/                 Playwright end-to-end and accessibility tests
tests/fixtures/        Fixture posts used by test builds
```

## Quality

Every pull request runs [CI](.github/workflows/ci.yml), which must pass before anything deploys:

- **Formatting:** Prettier
- **Linting:** ESLint with `typescript-eslint` (strict) and Astro accessibility rules (`jsx-a11y` strict)
- **Types:** TypeScript with Astro's `strictest` preset
- **Tests:** Playwright builds a test version of the site with fixture posts (in [`tests/fixtures/`](tests/fixtures/), never deployed) and checks every page on desktop and mobile, including [axe](https://github.com/dequelabs/axe-core) WCAG 2.2 AA checks in light and dark mode; see [`tests/site.spec.ts`](tests/site.spec.ts).

A pre-commit hook formats and lints staged files. Dependabot keeps dependencies and GitHub Actions current, and every action is pinned to a commit SHA.

## Deployment

Pushing to `main` runs CI; if it passes, the built site is deployed to GitHub Pages.

## Issues

Spotted a typo or a bug? [Open an issue](https://github.com/ET-CS/et-cs.github.io/issues).

## License

- **Code:** [MIT](LICENSE)
- **Content** (posts and page text): dedicated to the public domain under [CC0 1.0](LICENSE-CONTENT). Use it for anything, no permission or credit needed.
