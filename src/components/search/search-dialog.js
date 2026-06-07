import { createRef, default as React, useMemo, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"

import SearchBox from "./search-box"
import SearchResult from "./search-result"
import useClickOutside from "./use-click-outside"

import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"

function normalize(text = "") {
  return String(text).toLowerCase()
}

export default function SearchDialog({ open, handleClose }) {
  const data = useStaticQuery(graphql`
    {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 200) {
        nodes {
          id
          excerpt(pruneLength: 160)
          fields {
            slug
          }
          frontmatter {
            title
            description
            category
            tags
            date(formatString: "M/D/YYYY")
          }
        }
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)
  const rootRef = createRef()
  const [query, setQuery] = useState("")
  const [hasFocus, setFocus] = useState(false)
  const trimmedQuery = query.trim()
  const normalizedQuery = normalize(trimmedQuery)
  const storyResults = useMemo(() => {
    if (!normalizedQuery) return []

    return data.allMdx.nodes.filter(post => {
      const frontmatter = post.frontmatter
      const searchableText = [
        frontmatter.title,
        frontmatter.description,
        frontmatter.category,
        frontmatter.tags?.join(" "),
        post.excerpt,
      ]
        .filter(Boolean)
        .join(" ")

      return normalize(searchableText).includes(normalizedQuery)
    })
  }, [data.allMdx.nodes, normalizedQuery])

  const tagResults = useMemo(() => {
    if (!normalizedQuery) return []

    return data.allMdx.group.filter(tag =>
      normalize(tag.fieldValue).includes(normalizedQuery)
    )
  }, [data.allMdx.group, normalizedQuery])

  useClickOutside(rootRef, () => setFocus(false))

  return (
    <Dialog
      fullWidth
      maxWidth="string"
      open={open}
      onClose={handleClose}
      PaperProps={{ elevation: 0 }}
      sx={{
        backdropFilter: "blur(4px)",
        "& .MuiDialog-container": { alignItems: "flex-start" },
        "& .MuiDialog-paper": {
          marginTop: "6rem",
          mx: "1rem",
          width: "100%",
          maxWidth: "720px",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          "@media (max-width: 600px)": {
            marginTop: "2rem",
          },
        },
      }}
    >
      <Box ref={rootRef}>
        <SearchBox
          query={query}
          setQuery={setQuery}
          onFocus={() => setFocus(true)}
          hasFocus={hasFocus}
          handleClose={handleClose}
        />

        {trimmedQuery.length > 0 && (
          <SearchResult storyResults={storyResults} tagResults={tagResults} />
        )}
      </Box>
    </Dialog>
  )
}
