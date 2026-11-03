# et-cs.github.io

Personal site and blog of Itai Cohen-Solal, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
npm run preview  # serve the built site
```

## Writing posts

Add a Markdown (`.md`) or MDX (`.mdx`) file to `src/content/blog/`:

```markdown
---
title: 'My post'
description: 'One-line summary'
pubDate: '2026-11-03'
---

Post content here.
```

## Deploy

Every push to `master` builds and deploys the site via `.github/workflows/deploy.yml`.
One-time setup: in the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
