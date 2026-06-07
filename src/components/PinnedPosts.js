import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import ArticleIcon from "@mui/icons-material/Article"

const ClampTypography = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  lineClamp: "2",
  WebkitBoxOrient: "vertical",
}

const RecentPosts = () => (
  <StaticQuery
  // 原本：allMdx(filter: { frontmatter: { pinned: { eq: true } } })  篩選文章中 pinned = true 的文章
  // 改成由日期新到舊篩選五篇
    query={graphql`
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC } 
          limit: 5
        ) {
          nodes {
            frontmatter {
              title
              date(formatString: "MMMM DD, YYYY")
              description
              featuredImage {
                childImageSharp {
                  gatsbyImageData(aspectRatio: 1)
                }
              }
            }
            timeToRead
            fields {
              slug
            }
          }
        }
      }
    `}
    render={data => (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "text.primary",
            fontSize: "16px !important",
            letterSpacing: 0,
            fontWeight: "500",
            lineHeight: "20px",
          }}
        >
          近期發布
        </Typography>
        <Stack spacing={3}>
          {data.allMdx.nodes.map(item => {
            if (!item) return null
            return (
              <Box
                key={item.fields.slug}
                component={Link}
                to={item.fields.slug}
                rel={item}
                sx={{
                  textDecoration: "none",
                  color: "unset",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}
                    gutterBottom
                  >
                    <ArticleIcon fontSize="inherit"/>&nbsp;{`${item.frontmatter.date} • ${item.timeToRead}`} min read
                  </Typography>
                  <Typography
                    variant="body1"
                    style={ClampTypography}
                    sx={{
                      color: "text.primary !important",
                      fontWeight: "700",
                      lineHeight: "20px",
                      letterSpacing: "0",
                      transition: "color 0.2s ease-in-out",
                      "&:hover": {
                        color: "primary.main",
                      },
                      "@media (max-width: 900px)": {
                        "&:hover": {
                          color: "unset",
                        },
                      }
                    }}
                  >
                    {" "}
                    {item.frontmatter.title}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", maxWidth: "55px" }}>
                  <GatsbyImage
                    image={getImage(item.frontmatter.featuredImage)}
                    alt={item.frontmatter.featuredImage?.name}
                    style={{borderRadius: "4px"}}
                  />
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>
    )}
  ></StaticQuery>
)

export default RecentPosts
