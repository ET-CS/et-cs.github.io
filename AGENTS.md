# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Read it before making changes; follow it every time.

## Project

Personal site and blog of **Itai Cohen-Solal**, built with Astro 7 and deployed to GitHub Pages at https://et-cs.github.io.

- Name, as written everywhere: **Itai Cohen-Solal** (with the hyphen). Full name, used only on the About page: **Itai Sidney Cohen-Solal**.
- Handles: GitHub `ET-CS`, X `etaycs`. Personal site: https://etcs.me.
- Licenses: code is MIT (`LICENSE`); content is CC0 (`LICENSE-CONTENT`).
- This is a personal project with one author, not a community project: don't add community files (code of conduct, contributing guide, issue templates) unless the owner asks.
- Don't write or publish posts or personal content unless the owner asks for it.
- Never publish an email address or any other personal contact detail (in code, docs, metadata or commits) unless the owner explicitly authorizes it. Route reports through GitHub instead (issues, or private vulnerability reporting for security).

## Commands

```bash
npm ci                 # install
npm run dev            # dev server, http://localhost:4321
npm run validate       # format check + lint + type-check + build + tests (what CI runs)
npm run format         # auto-format
npm run lint:fix       # auto-fix lint issues
```

Tests run against the production build (`npm run build` first). If a Chromium is preinstalled instead of Playwright's own, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to it.

## Workflow

1. Branch from `master`. Never push directly to `master`.
2. Keep each pull request focused on one change.
3. `npm run validate` must pass before you push. Never skip, disable or weaken a test, lint rule or type check to get green; fix the cause.
4. For visual changes, check light and dark mode on desktop and mobile, and include screenshots in the PR.
5. Use Conventional Commits for commit messages and PR titles (`feat:`, `fix:`, `docs:`, `chore(deps):` and so on).
6. Squash-merge PRs once CI is green. Merging to `master` deploys the site.

## Code standards

- **TypeScript:** Astro's `strictest` preset. No `any`, no non-null assertions, no `@ts-ignore`. Model optional props as `prop?: T | undefined`.
- **Astro first:** components are `.astro` files rendered at build time. Add client-side JavaScript only for progressive enhancement, and the page must still work without it. Don't add a UI framework (React, Vue and so on) without a clear need.
- **Semantic, accessible HTML:** landmarks (`header`, `main`, `footer`, `nav`), one `h1` per page, real `button`/`a` elements, labels for icon-only controls. The axe tests enforce WCAG 2.2 AA in both themes.
- **Small, focused components.** Shared data access goes in `src/lib/` (e.g. `getPosts()`), shared page chrome in `src/layouts/Base.astro`.
- **Dependencies:** prefer the platform and Astro built-ins. Every new dependency must earn its place; don't add one for something a few lines of code can do.
- **Comments** explain _why_, not _what_.
- **Tests:** new pages and behaviour get Playwright coverage in `tests/`.

## Design language

Editorial and monochrome: one narrow column, typography does the work. Keep new UI consistent with it.

- **Typeface:** Newsreader (variable, optical sizes), via `@fontsource-variable/newsreader`. Monospace uses the system stack.
- **Color:** only the tokens in `src/styles/global.css` (`--paper`, `--ink`, `--muted`, `--rule`, `--code-bg`), each defined for light and dark. Never hard-code colors in components; no accent color.
- **Layout:** a single column of width `--measure` (36rem) inside `.wrap`. Generous vertical space, hairline rules (`--rule`) as separators.
- **Links:** text links with a subtle underline; no icon rows.
- **Dark mode:** follows the OS by default; the header toggle overrides it and is stored in `localStorage` under `theme`.

## Content

Posts live in `src/content/blog/` as Markdown or MDX, validated by the schema in `src/content.config.ts` (`title`, `description`, `pubDate`, optional `updatedDate` and `heroImage`). Dates are calendar dates, formatted in UTC.
