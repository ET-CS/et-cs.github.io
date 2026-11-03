# AGENTS.md

Conventions for working in this repository, for human and AI contributors alike.

## Project

A small static site by Itai Sidney Cohen-Solal, built with Astro and deployed to GitHub Pages at https://et-cs.github.io. The maintainer's personal site is https://etcs.me, a separate project: biography and other personal content belong there, and this site links to it instead of repeating it.

- **Name:** use the full name, Itai Sidney Cohen-Solal, in the site title, metadata and docs; conversational copy uses Itai.
- **Scope:** a small site with a single maintainer. Add sections or features (such as tags, pagination or project pages) only at the maintainer's direction. Community scaffolding (code of conduct, contributing guide, issue templates) is intentionally omitted.
- **Content:** posts and page copy are written by the maintainer. Don't author or publish content without their direction.
- **Privacy:** don't add email addresses or other personal contact details anywhere in the repository, including code, docs, metadata and commit messages. The one exception is the addresses tools add to commits automatically: no-reply commit authors, `Co-Authored-By` trailers and Dependabot's `Signed-off-by` line.
- **Licensing:** code is MIT ([`LICENSE`](LICENSE)); content is CC0 ([`LICENSE-CONTENT`](LICENSE-CONTENT)).

## Commands

```bash
npm ci                 # install dependencies
npm run dev            # dev server at http://localhost:4321
npm run validate       # format check, lint, type-check, build and tests (what CI runs)
npm run format         # format all files
npm run lint:fix       # fix lint issues
```

`npm test` builds its own test version of the site (fixture posts from `tests/fixtures/blog/`, output in `dist-test/`), serves it on its own port and runs Playwright against it. Before the first run, install the browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use a preinstalled Chromium.

## Workflow

1. Branch from `main`; never push to `main` directly.
2. Keep each pull request focused on a single change, and update `README.md` and `AGENTS.md` in it when behavior or conventions change.
3. `npm run validate` must pass before pushing. Never skip, disable or weaken a test, lint rule or type check to make it pass; fix the cause.
4. For visual changes, check light and dark mode on desktop and mobile, and say in the pull request what you checked; attach screenshots when you can.
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and pull request titles, and write the pull request description with the sections in [`.github/pull_request_template.md`](.github/pull_request_template.md).
6. Squash-merge once CI is green. Merging to `main` deploys the site.

## Code standards

- **TypeScript:** Astro's `strictest` preset. No `any`, non-null assertions or `@ts-ignore`. Type optional props as `prop?: T | undefined`.
- **Astro first:** components are `.astro` files rendered at build time. Client-side JavaScript is for progressive enhancement only; every page must work without it. Don't introduce a UI framework without a clear need.
- **Accessibility:** semantic landmarks (`header`, `main`, `footer`, `nav`), one `h1` per page, native `button` and `a` elements, and labels for icon-only controls. Tests run axe's WCAG 2.2 AA rules in both themes.
- **Single source of truth:** site-wide settings (site URL, title, description, language, profile links, storage keys) live in `src/consts.ts`; code and tests import them instead of repeating their values. `SITE_TITLE` is the site's name, so copy that refers to the maintainer writes the name out (see **Name**). Build the URL of a post with `postUrl()`.
- **Structure:** small, focused components. Data access and shared types live in `src/lib/` (e.g. `getPosts()`, `Post`); the document head and shared page chrome live in `src/layouts/Base.astro`, which takes the page metadata as props.
- **Imports:** import types with a separate `import type` statement, not inline `type` specifiers (enforced by ESLint).
- **Dependencies:** prefer the platform and Astro built-ins. Add a dependency only when it clearly earns its place.
- **Comments** explain _why_, not _what_.
- **Tests:** new pages and behavior get Playwright coverage in `tests/`. Add a page to `PAGES` in `tests/site.spec.ts` to get render, layout and accessibility checks; tag layout-sensitive tests `@responsive` so they also run on the mobile viewport. Tests run against fixture content, not real posts, and don't assert the maintainer's page copy.

## Design language

Editorial and monochrome: a single narrow column where typography does the work. New UI must follow it.

- **Typeface:** Newsreader (variable, with optical sizes) from `@fontsource-variable/newsreader`; code uses the system monospace stack.
- **Color:** use only the tokens in `src/styles/global.css` (`--paper`, `--ink`, `--muted`, `--rule`, `--code-bg`), each defined once for both themes with `light-dark()`. No hard-coded colors in components and no accent color.
- **Layout:** one column, `--measure` (36rem) wide, inside `.wrap`. Generous vertical rhythm; hairline rules (`--rule`) as separators.
- **Links:** text links with a subtle underline rather than icons.
- **Theme:** follows the operating system by default. The header toggle (shown only when JavaScript runs) overrides it via `data-theme` on `<html>` and persists the choice in `localStorage` under `THEME_STORAGE_KEY`.

## Content

Posts are Markdown (`.md`) files in `src/content/blog/`. Their frontmatter is validated by the strict schema in `src/content.config.ts`; the Writing a post section of `README.md` shows the format. Dates are calendar dates: show them with `FormattedDate`, which formats them in UTC.
