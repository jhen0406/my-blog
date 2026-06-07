# Gatsby Medium Blog 專案上手與 React 學習地圖

這份文件的目標不是一次把 React 全部教完，而是讓你能在短時間內看懂這個專案，知道「我要改成自己的網站時，應該改哪裡」，並且用這個專案當素材建立 React/Gatsby 的學習索引。

如果你沒學過 React，可以先照這個順序讀：

1. 先看「最快改成自己的內容」
2. 再看「專案結構」
3. 接著看「React 語法在這個專案怎麼出現」
4. 最後再回頭深入 Gatsby、MDX、GraphQL、Material UI

---

## 1. 這個網站是什麼

這是一個 Gatsby 做的個人部落格/作品集網站。

它使用：

- Gatsby：React 靜態網站框架，負責產生頁面、路由、build。
- React：負責 UI 元件。
- MDX：用 Markdown 寫文章，也可以在文章裡放 React 元件。
- GraphQL：Gatsby 內建資料查詢語法，用來拿文章、圖片、site metadata。
- Material UI，也常寫成 MUI：現成 React UI 元件庫，例如 `Box`、`Container`、`Tabs`、`Button`。
- Gatsby Image：圖片最佳化。
- Algolia：搜尋功能。
- GetForm：聯絡表單送出。

整體資料流：

```txt
content/posts/*.mdx
  -> Gatsby 讀取 MDX
  -> gatsby-node.js 建立文章 slug 和 tag 頁
  -> src/pages/index.js 查詢文章並顯示列表
  -> src/templates/post-detail.js 顯示單篇文章
  -> src/templates/tags.js 顯示某個 tag 的文章列表
```

---

## 2. 最快改成自己的內容

### 改網站基本資訊

檔案：`gatsby-config.js`

主要改這裡：

```js
siteMetadata: {
  title: `Brian Ruiz`,
  author: {
    name: `Brian Ruiz`,
    summary: `Brian Ruiz is a Software Engineer based out of Houston, TX.`,
  },
  description: `Brian Ruiz is a Software Engineer based out of Houston, TX.`,
  siteUrl: `https://b-r.io`,
  social: {
    linkedin: `brianruizy`,
    github: `BrianRuizy`,
    instagram: `brianruizy`,
    youtube: `UCCIFp-Se_xjfYc94H04oK7Q`,
  },
}
```

建議改成：

- `title`：你的名字或網站名稱
- `author.name`：你的名字
- `author.summary`：一句自我介紹
- `description`：SEO 描述
- `siteUrl`：你的網域
- `social`：你的社群帳號

### 改首頁文章列表

檔案：`src/pages/index.js`

這個檔案控制首頁：

- 頁面標題
- Blog / Gear List / My Links tab
- tag 列表
- 文章列表
- GraphQL 要查哪些文章欄位

文章列表不是手寫在這裡，而是從 `content/posts` 查出來。

### 新增或修改文章

資料夾：`content/posts`

每篇文章通常是一個資料夾：

```txt
content/posts/covid/index.mdx
content/posts/covid/iso.png
content/posts/covid/tech-stack.png
```

文章開頭的 `---` 區塊叫 frontmatter：

```mdx
---
title: How to create a COVID dashboard web application with Python
description: "Our application gained over 10k visits..."
date: "2021-06-06T23:46:37.121Z"
category: "Case Study"
tags: ["Project", "Python", "Django"]
featuredImage: "./iso.png"
pinned: true
---
```

你最常改：

- `title`：文章標題
- `description`：文章摘要
- `date`：發布日期
- `category`：分類
- `tags`：標籤
- `featuredImage`：文章封面
- `pinned`：是否出現在右側欄的 Pinned Stories

### 改右側個人介紹

檔案：`src/components/PanelRight.js`

這裡有作者資訊：

```jsx
<Typography variant="h3">Brian Ruiz</Typography>
<Typography variant="body2">Software Engineer</Typography>
```

以及簡介文字：

```jsx
I'm a full-stack Software Engineer based out of Houston, TX.
```

### 改社群連結

檔案：

- `src/components/socials.js`
- `src/pages/links.js`

`socials.js` 是右側欄的 Social media 區塊。

`links.js` 是 `/links` 頁。

目前兩邊都有 GitHub，且有一些社群被註解掉。你可以把 url、name、desc、icon 改成自己的。

### 改裝備清單

檔案：`src/pages/gear.js`

資料直接寫在 `gear` 物件裡：

```js
const gear = {
  "Orbitkey Desk Mat": {
    category: "Desk Setup",
    image: "...",
    desc: "...",
    stores: {
      amazon: {
        affiliateLink: "...",
        icon: "...",
      },
    },
  },
}
```

如果不需要 Gear List，可以從首頁 tab 移除，或把 `gear.js` 改成你自己的頁面。

### 改聯絡資訊

檔案：

- `src/components/ContactDrawer.js`
- `src/components/PanelRight.js`

`ContactDrawer.js` 裡有 GetForm endpoint：

```jsx
<form action="https://getform.io/f/..." method="POST">
```

`PanelRight.js` 裡有 email：

```js
window.location.href = "mailto:brianruiz0123@gmail.com"
```

### 改頭像與靜態圖片

相關位置：

- `static/avatar.png`
- `static/og-image.png`
- `src/images/avatar.png`
- `src/components/layout.js`
- `src/components/PanelLeft.js`
- `src/components/PanelRight.js`
- `src/templates/post-detail.js`

目前有些頭像使用完整 URL：

```jsx
src="https://www.b-r.io/avatar.png"
```

改成自己的網站時，建議統一成自己的圖片來源。

---

## 3. 專案結構與各檔案說明

### 根目錄

```txt
.
├── content/posts/
├── src/
├── static/
├── gatsby-config.js
├── gatsby-node.js
├── gatsby-browser.js
├── package.json
├── package-lock.json
├── README.md
├── frontmatter.json
├── profiles.json
└── LICENSE
```

### `package.json`

用途：管理套件與指令。

常用指令：

```bash
npm run develop
npm run build
npm run clean
npm run serve
```

其中：

- `develop`：開發模式
- `build`：產生正式網站
- `serve`：預覽 build 後網站
- `clean`：清 Gatsby 快取

### `gatsby-config.js`

用途：Gatsby 主要設定檔。

包含：

- `siteMetadata`：網站標題、作者、描述、社群帳號。
- `gatsby-source-filesystem`：指定 Gatsby 要讀哪些資料夾。
- `gatsby-plugin-mdx`：讓 Gatsby 能讀 `.mdx` 文章。
- `gatsby-remark-images`：處理 Markdown 裡的圖片。
- `gatsby-plugin-feed`：產生 `/rss.xml`。
- `gatsby-plugin-manifest`：PWA manifest。
- `gatsby-plugin-offline`：離線支援。
- `gatsby-plugin-algolia`：搜尋索引。

這是「網站設定中心」。

### `gatsby-node.js`

用途：Gatsby build 階段執行的 Node.js 程式。

這個專案主要做三件事：

1. 查詢所有 MDX 文章。
2. 幫每篇文章建立頁面。
3. 幫每個 tag 建立頁面。

關鍵程式：

```js
createPage({
  path: post.fields.slug,
  component: postTemplate,
  context: {
    id: post.id,
    previousPostId,
    nextPostId,
  },
})
```

意思是：每篇文章會使用 `src/templates/post-detail.js` 這個模板來產生頁面。

### `gatsby-browser.js`

用途：瀏覽器端的全域設定。

這裡載入：

- 字體
- normalize.css
- 全域 CSS
- Prism 程式碼高亮樣式

```js
import "./src/styles/style.css"
```

### `content/posts`

用途：文章內容。

每篇文章是 MDX 檔。MDX = Markdown + JSX。

你可以寫一般 Markdown：

```md
# 標題

這是一段文字。
```

也可以放 React 元件：

```mdx
<Alert severity="warning">
  Note that the example code is incomplete.
</Alert>
```

這些 MDX 元件會由 `src/components/MdxComponents.js` 定義樣式。

### `static`

用途：直接複製到網站根目錄的靜態檔案。

例如：

- `static/avatar.png` 對應網站上的 `/avatar.png`
- `static/og-image.png` 對應 `/og-image.png`
- `static/robots.txt` 對應 `/robots.txt`
- `static/favicons/*` 對應 `/favicons/*`

### `src/pages`

用途：Gatsby 的檔案式路由。

檔名會變成網址：

```txt
src/pages/index.js          -> /
src/pages/links.js          -> /links/
src/pages/gear.js           -> /gear/
src/pages/tags.js           -> /tags/
src/pages/404.js            -> 404 頁
src/pages/using-typescript.tsx -> /using-typescript/
```

### `src/templates`

用途：動態頁面模板。

- `post-detail.js`：單篇文章頁模板。
- `tags.js`：單一 tag 頁模板。
- `post.js`：文章列表項目元件，雖然放在 templates，但它比較像 component。

### `src/components`

用途：共用 React 元件。

重要檔案：

- `layout.js`：全站共同外框。
- `PanelLeft.js`：桌面左側導覽列。
- `PanelRight.js`：桌面右側資訊欄。
- `BottomNav.js`：手機底部導覽列。
- `seo.js`：SEO meta tags。
- `MdxComponents.js`：MDX 文章內容樣式。
- `PinnedPosts.js`：右側欄精選文章。
- `tagsPanel.js`：首頁 tag 橫向列表。
- `socials.js`：社群連結。
- `ContactDrawer.js`：聯絡表單抽屜。
- `ProgressAppBar.js`：文章頁閱讀進度列。

### `src/components/search`

用途：Algolia 搜尋。

- `search-dialog.js`：搜尋彈窗。
- `search-box.js`：搜尋輸入框。
- `search-result.js`：搜尋結果列表。
- `use-click-outside.js`：點擊外部時取消 focus 的 hook。

### `src/styles`

用途：CSS。

- `normalize.css`：讓不同瀏覽器預設樣式一致。
- `style.css`：專案全域樣式。
- `prism/one-dark.css`、`prism/one-light.css`：程式碼區塊樣式。

### `src/utils/algolia-queries.js`

用途：定義 build 時送進 Algolia 的資料格式。

它建立兩個索引：

- `Stories`：文章搜尋。
- `Tags`：tag 搜尋。

---

## 4. React 重要概念，以及本專案哪裡用到

這一段是你的 React 學習大綱。你不需要一次學完，但可以照著每個主題去專案裡找例子。

---

## 4.1 React 元件是什麼

React 的 UI 是由「元件」組成。

一個元件通常是一個 JavaScript function，回傳一段 JSX。

例子：`src/templates/post.js`

```jsx
const PostItem = ({ data }) => {
  return (
    <article style={{ width: "100%" }}>
      ...
    </article>
  )
}

export default PostItem
```

你可以把元件想成「可重複使用的畫面區塊」。

這個專案的元件分工：

- `Layout`：整個網站骨架。
- `PanelLeft`：左側欄。
- `PanelRight`：右側欄。
- `Post`：文章列表卡片。
- `Seo`：SEO 設定。
- `ContactDrawer`：聯絡表單。

---

## 4.2 JSX：React 的模板語法

React 沒有 Vue 的 `v-if`、`v-for`，也沒有 Angular 的 `ng-if`、`ngFor`。

React 用 JavaScript 本身來寫邏輯，然後回傳 JSX。

JSX 看起來像 HTML，但其實是 JavaScript。

例子：

```jsx
<Typography variant="h4">
  <Link to="/">{title}</Link>
</Typography>
```

JSX 裡常見規則：

### class 要寫成 `className`

HTML：

```html
<div class="box"></div>
```

React：

```jsx
<div className="box"></div>
```

這個專案大多使用 MUI 的 `sx`，所以比較少看到 `className`。

### style 是物件

HTML：

```html
<div style="width: 100%;"></div>
```

React：

```jsx
<article style={{ width: "100%" }}>
```

第一層 `{}` 表示我要進入 JavaScript，第二層 `{}` 是 JavaScript 物件。

### JSX 裡放 JavaScript 要用 `{}`

例子：`src/templates/post.js`

```jsx
{data.frontmatter.title || data.fields.slug}
```

例子：`src/pages/index.js`

```jsx
{posts.map(post => {
  return <Post data={post} />
})}
```

---

## 4.3 條件渲染：React 版的 `v-if`

React 沒有 `v-if`。

常見寫法是：

### 使用 `&&`

例子：`src/components/layout.js`

```jsx
{isRootPath && (
  <Avatar alt="Brian Ruiz" src="https://www.b-r.io/avatar.png">
    BR
  </Avatar>
)}
```

意思是：如果 `isRootPath` 是 true，才顯示 Avatar。

### 使用三元運算子

例子：`src/components/BottomNav.js`

```jsx
{props.isRootPath ? (
  <HomeIcon sx={{ color: "text.primary" }} />
) : (
  <HomeOutlinedIcon />
)}
```

意思是：如果在首頁，顯示實心 Home icon；否則顯示外框 Home icon。

### 使用 `if` 提前 return

例子：`src/pages/index.js`

```jsx
if (posts.length === 0) {
  return (
    <Layout location={location} title={siteTitle}>
      <p>No blog posts found.</p>
    </Layout>
  )
}
```

意思是：如果沒有文章，就直接回傳空文章提示。

---

## 4.4 列表渲染：React 版的 `v-for`

React 沒有 `v-for`。

React 通常用陣列的 `.map()`。

例子：`src/pages/index.js`

```jsx
{posts.map(post => {
  return (
    <Grid item xs={12} key={post.id}>
      <Post data={post} />
    </Grid>
  )
})}
```

重點：

- `posts` 是文章陣列。
- `.map()` 會把每篇文章轉成一個 React 元件。
- 每個列表項目需要 `key`，讓 React 知道每個項目的身份。

例子：`src/pages/gear.js`

```jsx
{categories.map(category => (
  <Accordion defaultExpanded>
    ...
  </Accordion>
))}
```

例子：`src/components/socials.js`

```jsx
{Object.keys(profiles).map(key => {
  const profile = profiles[key]
  return (
    <Box key={profile.name}>
      ...
    </Box>
  )
})}
```

---

## 4.5 Props：父元件傳資料給子元件

Props 是 React 的父子資料傳遞方式。

父元件：

```jsx
<Post data={post} />
```

子元件：`src/templates/post.js`

```jsx
const PostItem = ({ data }) => {
  const image = getImage(data.frontmatter.featuredImage)
  ...
}
```

這裡的 `data={post}` 就是把 `post` 傳給 `PostItem`。

常見範例：

### `Layout` 接收 children

`src/components/layout.js`

```jsx
const Layout = ({ location, title, extraDrawerContent, extraFooterContent, children }) => {
  return (
    <>
      ...
      <main>{children}</main>
      ...
    </>
  )
}
```

使用方式：`src/pages/index.js`

```jsx
<Layout location={location} title={siteTitle}>
  <Seo title="Portfolio" />
  <Container>...</Container>
</Layout>
```

`Layout` 標籤中間的內容會變成 `children`。

這是 React 很重要的組合模式。

### 傳 React 元件當 props

`src/components/layout.js`

```jsx
<PanelLeft
  isRootPath={isRootPath}
  ThemeButton={<ThemeIconButton darkModeHook={darkModeHook} />}
/>
```

這裡不只傳文字或資料，也把一個元件傳給 `PanelLeft`。

---

## 4.6 State：元件自己的狀態

React 的 state 是「會影響畫面的資料」。

使用方式：

```jsx
const [value, setValue] = React.useState(0)
```

`value` 是目前值。

`setValue` 是更新值的 function。

例子：`src/pages/index.js`

```jsx
const [value, setValue] = React.useState(0)

const handleChange = (event, newValue) => {
  setValue(newValue)
}
```

這裡控制首頁 tabs 目前選到哪一個。

例子：`src/components/PanelRight.js`

```jsx
const [open, setOpen] = React.useState(false)
```

這裡控制搜尋彈窗是否打開。

例子：`src/templates/post-detail.js`

```jsx
const [width, setWidth] = useState(0)
```

這裡控制文章閱讀進度條百分比。

---

## 4.7 Event handler：事件處理

React 裡常見事件：

- `onClick`
- `onChange`
- `onFocus`
- `onClose`
- `onSubmit`

例子：按鈕點擊。

`src/components/PanelRight.js`

```jsx
<Button
  onClick={() => {
    window.location.href = "mailto:brianruiz0123@gmail.com"
  }}
>
  Contact Me
</Button>
```

例子：搜尋輸入。

`src/components/search/search-box.js`

```jsx
onChange={e => refine(e.target.value)}
```

例子：複製文章連結。

`src/templates/post-detail.js`

```jsx
const handleTooltipOpen = () => {
  setOpen(true)
  navigator.clipboard.writeText(`https://b-r.io${location.pathname}`)
  setTimeout(() => {
    setOpen(false)
  }, 700)
}
```

---

## 4.8 useEffect：React 的生命週期概念

React function component 沒有 Vue 那種 `mounted`、`updated`、`destroyed` 名稱。

React 常用 `useEffect` 處理生命週期相關事情，例如：

- 元件出現後 fetch 資料
- 加事件監聽
- 移除事件監聽
- 和瀏覽器 API 互動

例子：`src/components/socials.js`

```jsx
React.useEffect(() => {
  fetch("https://api.github.com/users/jhen0406")
    .then(res => res.json())
    .then(data => {
      setGitFollowers(data.followers)
    })
}, [])
```

`[]` 表示這個 effect 只在元件第一次出現時執行一次。

例子：`src/components/PanelRight.js`

```jsx
useEffect(() => {
  document.addEventListener("keydown", handleKeyPress)

  return () => {
    document.removeEventListener("keydown", handleKeyPress)
  }
}, [handleKeyPress])
```

這裡做兩件事：

1. 元件出現時，加上鍵盤事件。
2. 元件消失或 effect 重跑前，移除鍵盤事件。

`return () => { ... }` 是 cleanup。

例子：`src/templates/post-detail.js`

```jsx
useEffect(() => {
  window.addEventListener("scroll", scrollHeight)
  return () => window.removeEventListener("scroll", scrollHeight)
})
```

這裡監聽 scroll，更新閱讀進度。

---

## 4.9 Hook 是什麼

Hook 是 React function component 使用狀態、生命週期、記憶化等功能的方式。

這個專案用到：

- `React.useState`
- `React.useEffect`
- `React.useMemo`
- `useCallback`
- `useDarkMode`
- MUI 的 `useScrollTrigger`
- 自訂 hook：`useClickOutside`

例子：`src/components/layout.js`

```jsx
const darkModeHook = useDarkMode(false)
const mode = darkModeHook.value === false ? "light" : "dark"
```

這個 hook 用來控制暗色模式。

例子：`src/components/search/search-dialog.js`

```jsx
const searchClient = useMemo(
  () =>
    algoliasearch(
      process.env.GATSBY_ALGOLIA_APP_ID,
      process.env.GATSBY_ALGOLIA_SEARCH_KEY
    ),
  []
)
```

`useMemo` 用來避免每次 render 都重新建立 search client。

---

## 4.10 Import / Export：檔案之間怎麼合作

React 專案會大量使用 import/export。

例子：`src/pages/index.js`

```js
import Post from "../templates/post"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Tags from "../components/tagsPanel"
```

意思是：

- 從 `src/templates/post.js` 引入文章卡片。
- 從 `src/components/layout.js` 引入全站外框。
- 從 `src/components/seo.js` 引入 SEO 元件。
- 從 `src/components/tagsPanel.js` 引入 tag panel。

元件檔案通常最後會：

```js
export default Layout
```

這樣其他檔案才能 import。

---

## 4.11 CSS、MUI、HTML 怎麼合作

這個專案的畫面樣式主要有三種來源：

### 1. 全域 CSS

檔案：

- `src/styles/normalize.css`
- `src/styles/style.css`

由 `gatsby-browser.js` 載入。

### 2. MUI 元件

例子：

```jsx
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
```

MUI 元件本質上還是 React 元件，但已經包好常見樣式與行為。

### 3. `sx` prop

MUI 最常用的樣式寫法是 `sx`：

```jsx
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    "@media (max-width: 600px)": {
      gap: "1.5rem",
    },
  }}
>
```

`sx` 裡寫的是 JavaScript object，不是純 CSS 字串。

CSS：

```css
display: flex;
flex-direction: column;
```

MUI `sx`：

```js
display: "flex",
flexDirection: "column",
```

注意：CSS 的 `kebab-case` 在 JS object 裡通常變成 `camelCase`。

---

## 4.12 Gatsby 的頁面與路由

Gatsby 有兩種頁面來源。

### 1. `src/pages` 自動路由

```txt
src/pages/index.js -> /
src/pages/links.js -> /links/
src/pages/gear.js -> /gear/
src/pages/tags.js -> /tags/
```

你新增：

```txt
src/pages/about.js
```

就會有：

```txt
/about/
```

### 2. `gatsby-node.js` 動態建立頁面

文章頁與 tag 頁不是直接放在 `src/pages`，而是 build 時由 `createPage` 產生。

文章模板：

```js
const postTemplate = path.resolve(`./src/templates/post-detail.js`)
```

Tag 模板：

```js
const tagTemplate = path.resolve("src/templates/tags.js")
```

---

## 4.13 Gatsby GraphQL 查資料

Gatsby 頁面可以 export 一個 GraphQL query。

例子：`src/pages/index.js`

```js
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 200) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          description
          tags
        }
      }
    }
  }
`
```

查到的資料會進入頁面 component 的 `data` props：

```jsx
const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMdx.nodes
}
```

重點：

- Gatsby 不是在瀏覽器即時查資料。
- 大多數 GraphQL 是 build/develop 階段由 Gatsby 處理。
- 查到的資料會被塞進 component。

---

## 4.14 MDX 與 React

文章是 MDX，所以可以寫 Markdown，也可以放 JSX 元件。

例子：`content/posts/covid/index.mdx`

```mdx
<Alert severity="warning">
  Note that the example code is incomplete for concision.
</Alert>
```

這個 `Alert` 來自 `src/components/MdxComponents.js`：

```jsx
Alert: props => (
  <Alert
    sx={{
      backgroundColor: "background.alt",
      lineHeight: "20px",
    }}
    {...props}
  />
)
```

文章頁使用：

```jsx
<MDXProvider components={shortcodes}>
  <MDXRenderer>{post.body}</MDXRenderer>
</MDXProvider>
```

位置：`src/templates/post-detail.js`

意思是：文章內的 Markdown/MDX 會被轉成 React 元件，並套用 `shortcodes` 定義的樣式。

---

## 4.15 Component composition：組合式 UI

React 很常把畫面拆成小元件再組合。

例子：`src/components/layout.js`

```jsx
<PanelLeft
  isRootPath={isRootPath}
  ThemeButton={<ThemeIconButton darkModeHook={darkModeHook} />}
/>

<main>
  {children}
</main>

<PanelRight extraDrawerContent={extraDrawerContent} />

<BottomNav isRootPath={isRootPath} darkModeHook={darkModeHook} />
```

`Layout` 不知道每個頁面的內容是什麼，它只負責網站共同外框。

每個頁面把自己的內容塞進：

```jsx
<Layout>
  頁面自己的內容
</Layout>
```

這就是 React 很常見的組合方式。

---

## 4.16 常見 React 寫法對照 Vue/Angular

| 目的 | Vue | Angular | React |
| --- | --- | --- | --- |
| 條件顯示 | `v-if` | `*ngIf` | `{condition && <A />}` 或三元運算子 |
| 列表 | `v-for` | `*ngFor` | `{items.map(item => <A key={...} />)}` |
| 傳資料給子元件 | props | `@Input()` | props |
| 子元件通知父元件 | emit | `@Output()` | 傳 callback function |
| 狀態 | `data` / `ref` | component state | `useState` |
| 生命週期 | `mounted` | `ngOnInit` | `useEffect` |
| 樣式綁定 | `:style` | `[style]` | `style={{...}}` 或 MUI `sx={{...}}` |
| class 綁定 | `:class` | `[class]` | `className` |

---

## 5. 這個專案值得你優先學的順序

### 第一階段：能改內容

先學：

1. `content/posts` 的 MDX frontmatter。
2. `gatsby-config.js` 的 `siteMetadata`。
3. `src/components/PanelRight.js` 的個人資訊。
4. `src/components/socials.js` 和 `src/pages/links.js` 的社群連結。
5. `src/pages/gear.js` 的資料物件。

這階段你不用完全懂 React。

### 第二階段：能看懂頁面

學：

1. JSX 基本語法。
2. 元件 function。
3. props。
4. `.map()` 列表渲染。
5. 條件渲染。
6. MUI `sx`。

對照檔案：

- `src/pages/index.js`
- `src/templates/post.js`
- `src/components/PanelRight.js`
- `src/components/socials.js`

### 第三階段：能改互動

學：

1. `useState`
2. `onClick`
3. `onChange`
4. `useEffect`
5. dialog/drawer open/close 狀態

對照檔案：

- `src/pages/index.js`
- `src/components/PanelLeft.js`
- `src/components/PanelRight.js`
- `src/components/BottomNav.js`
- `src/templates/post-detail.js`

### 第四階段：能改資料來源與頁面產生邏輯

學：

1. Gatsby file-based routing。
2. Gatsby GraphQL。
3. `gatsby-node.js` 的 `createPage`。
4. MDX。
5. Gatsby Image。

對照檔案：

- `gatsby-node.js`
- `src/pages/index.js`
- `src/templates/post-detail.js`
- `src/templates/tags.js`
- `gatsby-config.js`

---

## 6. 常見修改任務與入口檔案

### 我要改網站名字

改：

- `gatsby-config.js`
- 可能也要改 `src/components/layout.js` 裡 hard-coded 的 GitHub repo/footer 文字。

### 我要改作者名字

改：

- `gatsby-config.js`
- `src/components/PanelRight.js`
- `src/templates/post-detail.js`
- `src/components/ContactDrawer.js`
- `src/components/layout.js`

### 我要新增 About 頁

新增：

```txt
src/pages/about.js
```

可參考 `src/pages/links.js` 的結構。

### 我要移除 Gear List

改：

- `src/pages/index.js`：移除 Gear List tab。
- `src/pages/links.js`：移除 Gear List tab。
- 可選：刪除或保留 `src/pages/gear.js`。

### 我要改文章卡片樣式

改：

- `src/templates/post.js`

### 我要改文章內容排版

改：

- `src/components/MdxComponents.js`
- `src/styles/style.css`

### 我要改整站配色

改：

- `src/components/layout.js`

主要看：

```js
createTheme({
  palette: {
    mode,
    ...
  },
})
```

### 我要關掉右側欄

改：

- `src/components/layout.js`
- `src/components/PanelRight.js`

但要注意桌面版 layout 目前預設有左中右三欄。

### 我要改搜尋

改：

- `gatsby-config.js`
- `src/utils/algolia-queries.js`
- `src/components/search/*`

也要設定 `.env`：

```env
GATSBY_ALGOLIA_APP_ID=
GATSBY_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=
```

---

## 7. 閱讀這個專案時的注意事項

### 有些名稱不精準

例如 `src/pages/links.js` 裡 component 叫：

```js
const NotFoundPage = ...
```

但它其實是 Links 頁，不是 404。

這種情況通常是複製檔案後忘記改名，不影響功能，但會讓新手混淆。

### 有些資料 hard-coded

例如：

- GitHub repo URL
- 作者名字
- email
- avatar URL
- social profile
- Gear 清單

要改成自己的網站時，優先搜尋 `Brian`、`b-r.io`、`brianruiz`、`jhen0406`。

### 有些設定需要外部服務

搜尋和表單需要：

- Algolia
- GetForm

如果你只是本機學習，可以先不處理，等 build/deploy 前再設定。

### 目前 `profiles.json` 似乎沒有內容

目前社群資料直接寫在 `socials.js` 和 `links.js`，沒有從 `profiles.json` 讀取。

---

## 8. 建議你的學習任務

照下面做，會很快有手感：

1. 改 `gatsby-config.js` 的 `title`、`author`、`description`。
2. 改 `PanelRight.js` 的姓名、職稱、簡介。
3. 改 `socials.js` 的 GitHub 連結。
4. 在 `content/posts` 複製一篇文章資料夾，改成自己的第一篇文章。
5. 在 `src/pages/about.js` 新增一個 About 頁。
6. 在首頁 `src/pages/index.js` 加一個 About tab。
7. 改 `src/templates/post.js` 的文章卡片樣式。
8. 改 `src/components/MdxComponents.js` 的文章段落字體或間距。

做到這裡，你會碰到 React 最核心的幾件事：

- JSX
- component
- props
- state
- map
- conditional rendering
- event handler
- MUI sx
- Gatsby page query

---

## 9. 你可以先記住的 React 心法

React 的思考方式是：

```txt
資料 -> 元件 -> 畫面
```

當資料變了，React 重新計算畫面。

在這個專案中：

- 文章資料來自 MDX + GraphQL。
- 網站設定來自 `gatsby-config.js`。
- 畫面由 React components 組成。
- 樣式大多用 MUI `sx`。
- 頁面路由由 Gatsby 管理。

你一開始不用追所有細節。先能做到「我知道我要改哪個檔案」，再逐步理解「為什麼這樣寫」。
