# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概覽

個人部落格「JC's blog」，部署在 Netlify（https://jc-myblog.netlify.app），使用 **Gatsby 4 + MDX v1 + MUI 5**，fork 自 gatsby-medium-blog starter。文章內容與介面文字大多是繁體中文。Commit 訊息格式為 `feat: ...` / `fix: ...`，描述用中文。

`PROJECT_REACT_GUIDE.md` 是一份很長的中文上手指南（要改什麼該去哪裡改、React/Gatsby 概念）。需要細節時可以參考，但裡面有些範例還是原始 starter 的設定值。

## 指令

需要 Node 18（`nvm use 18`）。如果 `npm install` 失敗，改用 `npm install --legacy-peer-deps`。

- `npm run develop`（或 `gatsby develop`）：開發伺服器，網址 http://localhost:8000，GraphiQL 在 `/___graphql`
- `npm run build`：產生正式版網站到 `public/`
- `npm run serve`：在 http://localhost:9000 開啟 build 好的網站
- `npm run clean`：清除 `.cache` 和 `public`（GraphQL schema 或 node 的修改沒出現時先執行這個）
- `npm run format`：Prettier 格式化（`semi: false`、`arrowParens: "avoid"`）

專案沒有測試也沒有 linter，`npm test` 只是會以錯誤結束的佔位指令。修改後用 `npm run build` 確認沒有錯誤。

## 架構

**文章到頁面的流程**
- 文章放在 `content/posts/<資料夾>/index.mdx`，圖片放在同一個資料夾（`featuredImage: "./foo.jpg"` 由 `gatsby-transformer-sharp` 處理）。網址 slug 是 `gatsby-node.js` 裡的 `createFilePath` 依資料夾名稱產生的。
- `gatsby-node.js` 用 `src/templates/post-detail.js` 替每篇文章建立頁面（文章依日期由舊到新排序，context 帶 `previousPostId`/`nextPostId`），並用 `src/templates/tags.js` 替每個 tag 建立 `/tag/<kebab-case-tag>/` 頁面。
- `src/templates/post.js` **不是**頁面模板，而是文章卡片元件，被 `index.js`、`tags.js`、`post-detail.js` 共用。
- 使用的 frontmatter 欄位：`title`、`description`、`date`、`category`、`tags`（陣列）、`featuredImage`、`pinned`。`frontmatter.json` 是 Front Matter VS Code 擴充套件的設定，使用同一套欄位。

**閱讀時間：** `gatsby-node.js` 新增了自訂的 `Mdx.chineseTimeToRead` resolver（中文每分鐘 400 字、英文每分鐘 200 個單字，會先移除 frontmatter、程式碼區塊、JSX 和圖片/連結語法）。查詢時用 `chineseTimeToRead`，不是 Gatsby 內建的 `timeToRead`。新增文章列表查詢時記得加上這個欄位。

**「置頂」文章：** `src/components/PinnedPosts.js` 目前顯示的是最新 5 篇文章，不是 `pinned: true` 的文章（原本的篩選條件留在該檔案的註解裡）。

**版面與主題：** `src/components/layout.js` 建立 MUI theme（亮色/暗色配色，包含自訂的 `text.postBody`、`background.alt`/`appBar`），並用 `use-dark-mode` 切換暗色模式。頁面外框由 `PanelLeft`（桌面版左側導覽）、`PanelRight`（作者/置頂文章/tags 側欄）、`BottomNav`（手機版）和 `ProgressAppBar` 組成。全域 CSS 和 Prism 主題在 `gatsby-browser.js` 匯入。

**MDX 渲染：** `src/components/MdxComponents.js` 把 Markdown 元素（p、h1 等）對應到有樣式的 MUI 元件。要改文章字體排版請改這裡，不是改 CSS。程式碼高亮使用 `gatsby-remark-prismjs`，全域開啟行號。

**搜尋（Algolia）：** 介面在 `src/components/search/`，從導覽列開啟。索引資料由 `src/utils/algolia-queries.js` 產生（`Stories` 和 `Tags` 兩個索引；會額外加一個把中文字以空格分開的 `searchText` 欄位，讓中文可以被搜尋）。`gatsby-config.js` 裡的 `gatsby-plugin-algolia` **被註解掉了**，所以 build 時不會更新 Algolia 索引。要重新建索引就取消註解，並在 `.env` 設定 `GATSBY_ALGOLIA_APP_ID`、`GATSBY_ALGOLIA_SEARCH_KEY`、`ALGOLIA_ADMIN_KEY`（`gatsby-config.js` 用 `dotenv` 讀取）。

**其他整合：** 聯絡表單送到 getform.io（`src/components/ContactDrawer.js`）；Google Tag Manager 只在正式版啟用；另有 `/rss.xml` RSS、PWA manifest 與離線支援（都在 `gatsby-config.js`）。網站標題、作者、社群連結在 `gatsby-config.js` 的 `siteMetadata`。Favicon 在 `static/favicons/`。
