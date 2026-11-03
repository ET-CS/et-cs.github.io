# AGENTS.md

Conventions for working in this repository, for human and AI contributors alike.

## Project

The personal site and blog of Itai Sidney Cohen-Solal, built with Astro and deployed to GitHub Pages at https://et-cs.github.io.

- **Name:** use the full name, Itai Sidney Cohen-Solal, in the site title, metadata and docs; conversational copy uses Itai.
- **Scope:** a personal site with a single maintainer. Community scaffolding (code of conduct, contributing guide, issue templates) is intentionally omitted.
- **Content:** posts and personal copy are written by the maintainer. Don't author or publish content without their direction.
- **Privacy:** don't add email addresses or other personal contact details anywhere in the repository, including code, docs, metadata and commit messages.
- **Licensing:** code is MIT ([`LICENSE`](LICENSE)); content is CC0 ([`LICENSE-CONTENT`](LICENSE-CONTENT)).

## Commands

```bash
npm ci                 # install dependencies
npm run dev            # dev server at http://localhost:4321
npm run validate       # format check, lint, type-check, build and tests (what CI runs)
npm run format         # format all files
npm run lint:fix       # fix lint issues
```

`npm test` builds its own test version of the site (fixture posts from `tests/fixtures/blog/`, output in `dist-test/`) and runs Playwright against it. To use a preinstalled Chromium instead of Playwright's own, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Workflow

1. Branch from `master`; never push to `master` directly.
2. Keep each pull request focused on a single change.
3. `npm run validate` must pass before pushing. Never skip, disable or weaken a test, lint rule or type check to make it pass; fix the cause.
4. For visual changes, check light and dark mode on desktop and mobile, and attach screenshots to the pull request.
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and pull request titles.
6. Squash-merge once CI is green. Merging to `master` deploys the site.

## Code standards

- **TypeScript:** Astro's `strictest` preset. No `any`, non-null assertions or `@ts-ignore`. Type optional props as `prop?: T | undefined`.
- **Astro first:** components are `.astro` files rendered at build time. Client-side JavaScript is for progressive enhancement only; every page must work without it. Don't introduce a UI framework without a clear need.
- **Accessibility:** semantic landmarks (`header`, `main`, `footer`, `nav`), one `h1` per page, native `button` and `a` elements, and labels for icon-only controls. Tests enforce WCAG 2.2 AA in both themes.
- **Single source of truth:** site-wide values (site URL, title, language, profile links, storage keys) live in `src/consts.ts`; never repeat a literal that's defined there. Build the URL of a post with `postUrl()`.
- **Structure:** small, focused components. Data access and shared types live in `src/lib/` (e.g. `getPosts()`, `Post`); shared page chrome lives in `src/layouts/Base.astro`, which takes page metadata (`title`, `description`, `image`, `article`, `noindex`).
- **Imports:** type-only imports use `import type` on their own line (enforced by ESLint).
- **Dependencies:** prefer the platform and Astro built-ins. Add a dependency only when it clearly earns its place.
- **Comments** explain _why_, not _what_.
- **Tests:** new pages and behaviour get Playwright coverage in `tests/`. Add a page to `PAGES` in `tests/site.spec.ts` to get render, layout and accessibility checks; tag layout-sensitive tests `@responsive` so they also run on the mobile viewport. Tests run against fixture content, not real posts.

## Design language

Editorial and monochrome: a single narrow column where typography does the work. New UI must follow it.

- **Typeface:** Newsreader (variable, with optical sizes) from `@fontsource-variable/newsreader`; code uses the system monospace stack.
- **Color:** use only the tokens in `src/styles/global.css` (`--paper`, `--ink`, `--muted`, `--rule`, `--code-bg`), each defined once for both themes with `light-dark()`. No hard-coded colors in components and no accent color.
- **Layout:** one column, `--measure` (36rem) wide, inside `.wrap`. Generous vertical rhythm; hairline rules (`--rule`) as separators.
- **Links:** text links with a subtle underline rather than icons.
- **Theme:** follows the operating system by default. The header toggle (shown only when JavaScript runs) overrides it via `data-theme` on `<html>` and persists the choice in `localStorage` under `THEME_STORAGE_KEY`.

## Content

Posts live in `src/content/blog/` as Markdown or MDX and are validated against the schema in `src/content.config.ts`: `title`, `description`, `pubDate`, and optional `updatedDate` and `heroImage` (`src` relative to the post, plus `alt`). Dates are calendar dates and are formatted in UTC.
