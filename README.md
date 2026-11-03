# et-cs.github.io

[![CI](https://github.com/ET-CS/et-cs.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/ET-CS/et-cs.github.io/actions/workflows/ci.yml)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Content: CC0](https://img.shields.io/badge/content-CC0-lightgrey.svg)](LICENSE-CONTENT)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg)](https://astro.build)

The personal site and blog of Itai Cohen-Solal: **[et-cs.github.io](https://et-cs.github.io)**.

A static site built with [Astro](https://astro.build): one column of well-set text, a light and dark theme, no client-side framework, and almost no JavaScript.

## Getting started

Requires Node.js (the version in [`.node-version`](.node-version); 22.23.4 or newer works).

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
| `npm test`         | Run the Playwright tests against the build               |
| `npm run validate` | Everything CI runs: format, lint, types, build and tests |

The first time you run tests, install the browser: `npx playwright install chromium`.

## Writing a post

Add a Markdown (`.md`) or MDX (`.mdx`) file to [`src/content/blog/`](src/content/blog/). The file name becomes the URL (`hello-world.md` → `/blog/hello-world/`).

```markdown
---
title: 'Hello, world'
description: 'One sentence that summarizes the post.'
pubDate: '2026-11-03'
---

The post, in Markdown.
```

Optional fields: `updatedDate` and `heroImage` (a path to an image in `src/assets/`). The schema lives in [`src/content.config.ts`](src/content.config.ts), so a typo in the frontmatter fails the build instead of shipping.

## Project structure

```text
src/
├── components/   Header, footer, post list, <head> metadata
├── content/blog/ Blog posts (Markdown / MDX)
├── layouts/      Base page layout and blog post layout
├── lib/          Data helpers (e.g. sorted posts)
├── pages/        Routes: home, writing, about, 404, RSS, robots.txt
└── styles/       global.css: design tokens and typography
tests/            Playwright end-to-end and accessibility tests
```

## Quality

Every pull request runs [CI](.github/workflows/ci.yml), which must pass before anything deploys:

- **Formatting:** Prettier
- **Linting:** ESLint with `typescript-eslint` (strict) and Astro accessibility rules (`jsx-a11y` strict)
- **Types:** TypeScript with Astro's `strictest` preset
- **Tests:** Playwright on desktop and mobile. Every page renders without errors, has no horizontal scrolling and passes [axe](https://github.com/dequelabs/axe-core) WCAG 2.2 AA checks in light and dark mode. Internal links resolve, the theme toggle works, and the 404 page, RSS, sitemap and robots.txt are served.

A pre-commit hook formats and lints staged files. Dependabot keeps dependencies and GitHub Actions current, and every action is pinned to a commit SHA.

## Deployment

Pushing to `master` runs CI; if it passes, the built site is deployed to GitHub Pages.

## Contributing

Fixes are welcome: typos, bugs, accessibility and performance. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). To report a security issue, see [SECURITY.md](SECURITY.md).

## License

- **Code:** [MIT](LICENSE)
- **Content** (posts and page text): dedicated to the public domain under [CC0 1.0](LICENSE-CONTENT). Use it for anything, no permission or credit needed.
