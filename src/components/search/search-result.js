import { Link } from "gatsby"
import { default as React } from "react"

import kebabCase from "lodash/kebabCase"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListSubheader from "@mui/material/ListSubheader"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"

import ArticleIcon from "@mui/icons-material/Article"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"

const itemTextStyles = {
  "> .MuiTypography-body2": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    mr: 4,
  },
}

const EmptyState = () => (
  <Typography variant="body2" sx={{ color: "text.disabled", px: 3, py: 2 }}>
    No results found
  </Typography>
)

const ResultSection = ({ title, children }) => (
  <>
    <List
      subheader={
        <ListSubheader
          component="div"
          sx={{ background: "none", color: "text.disabled" }}
        >
          {title}
        </ListSubheader>
      }
      sx={{
        py: 1,
        "& ul": {
          padding: 0,
          listStyle: "none",
        },
      }}
    >
      {children}
    </List>
    <Divider sx={{ mx: 2, ":last-of-type": { display: "none" } }} />
  </>
)

const PageHit = ({ hit }) => (
  <ListItemButton component={Link} to={hit.fields.slug}>
    <ListItemIcon
      sx={{
        minWidth: "2.5rem",
        "@media (max-width: 600px)": { display: "none" },
      }}
    >
      <IconButton
        disableRipple
        size="small"
        sx={{
          backgroundColor: "action.selected",
          color: "text.primary",
        }}
      >
        <ArticleIcon sx={{ fontSize: "14px" }} />
      </IconButton>
    </ListItemIcon>
    <ListItemText
      primary={
        <>
          {hit.frontmatter.title}
          <Typography sx={{ color: "text.disabled", display: "inline" }}>
            －{hit.frontmatter.date}
          </Typography>
        </>
      }
      secondary={hit.frontmatter.description || hit.excerpt}
      sx={itemTextStyles}
    />
  </ListItemButton>
)

const TagHit = ({ hit }) => (
  <ListItemButton component={Link} to={`/tag/${kebabCase(hit.fieldValue)}/`}>
    <ListItemIcon
      sx={{
        minWidth: "2.5rem",
        "@media (max-width: 600px)": { display: "none" },
      }}
    >
      <IconButton
        disableRipple
        size="small"
        sx={{
          backgroundColor: "action.selected",
          color: "text.primary",
        }}
      >
        <LocalOfferIcon sx={{ fontSize: "14px" }} />
      </IconButton>
    </ListItemIcon>
    <ListItemText
      primary={
        <>
          {hit.fieldValue}
          <Typography sx={{ color: "text.disabled", display: "inline" }}>
            －{hit.totalCount}
          </Typography>
        </>
      }
    />
  </ListItemButton>
)

const SearchResult = ({ storyResults, tagResults }) => (
  <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
    <ResultSection title="Stories">
      {storyResults.length > 0 ? (
        storyResults.map(hit => <PageHit hit={hit} key={hit.id} />)
      ) : (
        <EmptyState />
      )}
    </ResultSection>
    <ResultSection title="Tags">
      {tagResults.length > 0 ? (
        tagResults.map(hit => <TagHit hit={hit} key={hit.fieldValue} />)
      ) : (
        <EmptyState />
      )}
    </ResultSection>
  </Box>
)

export default SearchResult
