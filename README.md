# Astro Blog — Migrated from Wix

A personal blog built with [Astro](https://astro.build), deployed to Cloudflare Pages.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Adding posts

Create a `.md` or `.mdx` file in `src/content/blog/`:

```markdown
---
title: "Post Title"
description: "One-line summary shown on the homepage"
date: 2024-03-01
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

The slug (URL) is derived from the filename: `hello-world.md` → `/post/hello-world`.

## Customise

| File | What to change |
|---|---|
| `src/layouts/Base.astro` | Site name, nav links, footer |
| `src/pages/index.astro` | Hero text on homepage |
| `src/pages/about.astro` | About page copy |
| `src/styles/global.css` | Colours (CSS vars at top), fonts |
| `astro.config.mjs` | Your domain (required for sitemap + RSS) |
| `public/_redirects` | Old Wix URL → new URL redirects |

## Deploy to Cloudflare Pages

```bash
# One-time setup
npm install -g wrangler
wrangler login

# Deploy
npx wrangler pages deploy dist --project-name=my-blog
```

Or connect the repo in the Cloudflare Pages dashboard (recommended for auto-deploy on push).

## Project structure

```
src/
  content/
    blog/          ← your .md post files go here
    config.ts      ← frontmatter schema
  layouts/
    Base.astro     ← HTML shell, header, footer
    Post.astro     ← individual post wrapper
  pages/
    index.astro    ← homepage post list
    about.astro    ← about page
    rss.xml.js     ← RSS feed
    post/
      [slug].astro ← dynamic post route
    tags/
      [tag].astro  ← tag archive pages
  styles/
    global.css     ← all styles
public/
  _redirects       ← Wix → Astro URL redirects
  favicon.svg
```
