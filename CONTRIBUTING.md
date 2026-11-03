# Contributing

Thanks for taking the time to help. This is a personal site, so new posts aren't accepted, but fixes are very welcome:

- Typos, broken links and factual errors
- Bugs and layout problems on any browser or device
- Accessibility and performance improvements
- Improvements to the code, tooling or docs

For anything larger than a small fix, please [open an issue](https://github.com/ET-CS/et-cs.github.io/issues/new/choose) first so we can agree on the approach.

## Setup

1. Install the Node.js version in [`.node-version`](.node-version).
2. Install dependencies and the test browser:

   ```bash
   npm ci
   npx playwright install chromium
   ```

3. Start the dev server: `npm run dev`.

## Making a change

1. Create a branch from `master`.
2. Make your change. Follow the existing code style; Prettier and ESLint enforce most of it, and a pre-commit hook runs them for you.
3. Add or update tests in [`tests/`](tests/) when you change behaviour.
4. Run the full check before pushing:

   ```bash
   npm run validate
   ```

5. Open a pull request. Fill in the template, and for visual changes include screenshots in light and dark mode.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, for example:

- `feat: add tag pages`
- `fix(header): keep nav on one line on small screens`
- `docs: explain post frontmatter`
- `chore(deps): update astro`

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

## Licensing of contributions

By contributing you agree that code contributions are licensed under the [MIT License](LICENSE), and content contributions (text in posts and pages) are dedicated to the public domain under [CC0 1.0](LICENSE-CONTENT).

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating you agree to uphold it.
