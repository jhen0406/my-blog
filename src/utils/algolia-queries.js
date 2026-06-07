const escapeStringRegexp = require("escape-string-regexp")

const pagePath = `content/posts`
const indexName = `Stories`
const indexName2 = `Tags`

const pageQuery = `{
  pages: allMdx(
    filter: {
      fileAbsolutePath: { regex: "/${escapeStringRegexp(pagePath)}/" },
    }
  ) {
    edges {
      node {
        id
        excerpt(pruneLength: 500)
        frontmatter {
          title
          date(formatString: "l")
          description
          category
          tags
        }
        fields {
          slug
        }
      }
    }
  }
}`

const pageQueryTags = `{
  tags: allMdx(limit: 200) {
    group(field: frontmatter___tags) {
      objectID: fieldValue
      fieldValue
      totalCount
    }
  }
}`

function splitCjkCharacters(text = "") {
  return String(text).match(/[\u3400-\u9fff]/g)?.join(" ") || ""
}

function pageToAlgoliaRecord({ node: { id, frontmatter, fields, ...rest } }) {
  const searchableText = [
    frontmatter.title,
    frontmatter.description,
    frontmatter.category,
    frontmatter.tags?.join(" "),
    rest.excerpt,
  ]
    .filter(Boolean)
    .join(" ")

  return {
    objectID: id,
    ...frontmatter,
    ...fields,
    ...rest,
    searchText: `${searchableText} ${splitCjkCharacters(searchableText)}`,
  }
}

function tagToAlgoliaRecord(tag) {
  return {
    objectID: tag.fieldValue,
    fieldValue: tag.fieldValue,
    totalCount: tag.totalCount, 
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName,
    settings: {
      searchableAttributes: [
        `title`,
        `tags`,
        `category`,
        `description`,
        `excerpt`,
        `searchText`,
      ],
      queryLanguages: [`zh`],
      attributesToSnippet: [`description:20`, `excerpt:30`, `date`, `tags`, `category`],
    },
    
  },
  {
    query: pageQueryTags,
    transformer: ({ data }) => data.tags.group.map( tag => (tagToAlgoliaRecord(tag))),
    indexName2, 
    settings: { attributesToSnippet: [`totalCount`] },
  },
]

module.exports = queries
