# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal blog ("JC's blog", deployed to Netlify at https://jc-myblog.netlify.app) built with **Gatsby 4 + MDX v1 + MUI 5**, forked from the gatsby-medium-blog starter. Content and UI copy are mostly Traditional Chinese (zh-TW). Commit messages follow `feat: ...` / `fix: ...` with Chinese descriptions.

`PROJECT_REACT_GUIDE.md` is a long Chinese onboarding guide to this codebase (where to change what, React/Gatsby concepts). Consult it for detail, but note some examples in it still show the original starter's values.

## Commands

Requires Node 18 (`nvm use 18`). If `npm install` fails, use `npm install --legacy-peer-deps`.

- `npm run develop` (or `gatsby develop`) — dev server at http://localhost:8000, GraphiQL at `/___graphql`
- `npm run build` — production build into `public/`
- `npm run serve` — serve the built site
- `npm run clean` — clear `.cache`/`public` (do this when GraphQL schema/node changes don't show up)
- `npm run format` — Prettier (`semi: false`, `arrowParens: "avoid"`)

There are no tests or linter; `npm test` is a placeholder that exits 1. Verify changes with `npm run build`.

## Architecture

**Content → pages pipeline**
- Posts live in `content/posts/<folder>/index.mdx` as page bundles, with images alongside (`featuredImage: "./foo.jpg"` is resolved by `gatsby-transformer-sharp`). The slug is derived from the folder name via `createFilePath` in `gatsby-node.js`.
- `gatsby-node.js` creates one page per post using `src/templates/post-detail.js` (with `previousPostId`/`nextPostId` context, posts sorted by date ASC) and one page per tag at `/tag/<kebab-case-tag>/` using `src/templates/tags.js`.
- `src/templates/post.js` is **not** a page template. It's the post-card component reused by `index.js`, `tags.js` and `post-detail.js`.
- Frontmatter fields used: `title`, `description`, `date`, `category`, `tags` (array), `featuredImage`, `pinned`. `frontmatter.json` configures the Front Matter VS Code extension to use the same schema.

**Reading time:** `gatsby-node.js` adds a custom `Mdx.chineseTimeToRead` resolver (400 Han chars/min + 200 English words/min, stripping frontmatter, code blocks, JSX and image/link markup). Queries use `chineseTimeToRead`, not Gatsby's built-in `timeToRead`. If you add a new post list query, request this field.

**"Pinned" posts:** `src/components/PinnedPosts.js` currently shows the 5 most recent posts, not posts with `pinned: true` (the original filter is left in a comment there).

**Layout & theming:** `src/components/layout.js` builds the MUI theme (light/dark palettes, custom keys such as `text.postBody` and `background.alt`/`appBar`) and toggles dark mode via `use-dark-mode`. The page shell is `PanelLeft` (desktop side nav), `PanelRight` (author/pinned/tags sidebar), `BottomNav` (mobile) and `ProgressAppBar`. Global CSS and Prism themes are imported in `gatsby-browser.js`.

**MDX rendering:** `src/components/MdxComponents.js` maps Markdown elements (p, h1, …) to styled MUI components. Change post typography there, not in CSS. Code highlighting uses `gatsby-remark-prismjs` with line numbers on globally.

**Search (Algolia):** UI is in `src/components/search/` and opened from the nav panels. Index records come from `src/utils/algolia-queries.js` (`Stories` and `Tags` indices; it adds a space-split `searchText` field so Chinese characters are searchable). The `gatsby-plugin-algolia` entry in `gatsby-config.js` is **commented out**, so builds do not push to Algolia. Uncomment it to reindex. It needs `GATSBY_ALGOLIA_APP_ID`, `GATSBY_ALGOLIA_SEARCH_KEY` and `ALGOLIA_ADMIN_KEY` in `.env`, which is loaded with `dotenv` in `gatsby-config.js`.

**Other integrations:** contact form posts to getform.io (`src/components/ContactDrawer.js`), Google Tag Manager runs in production only, plus RSS at `/rss.xml`, PWA manifest and offline support (all in `gatsby-config.js`). Site title, author and social links are in `siteMetadata` in `gatsby-config.js`. Favicons are in `static/favicons/`.
