import React from 'react'
import { graphql } from 'gatsby'
import { startCase, orderBy } from 'lodash'
import SEO from '../components/SEO'
import moment from 'moment'
import Layout from '../components/Layout'
import Card from '../components/Card'
import CardList from '../components/CardList'
import PageTitle from '../components/PageTitle'
import Pagination from '../components/Pagination'
import Container from '../components/Container'

const TagTemplate = ({ data, pageContext }) => {
  const posts = orderBy(
    data.contentfulTag.post,
    // eslint-disable-next-line
    [object => new moment(object.publishDateISO)],
    ['desc']
  )

  const { title } = data.contentfulTag
  const numberOfPosts = posts.length
  const skip = pageContext.skip
  const limit = pageContext.limit
  const { humanPageNumber, basePath } = pageContext

  let ogImage
  try {
    ogImage = posts[0].heroImage.ogimg.src
  } catch (error) {
    ogImage = null
  }

  return (
	<Layout>
        <SEO
          title={`Tag: ${startCase(title)}`}
          description={`Posts Tagged: ${startCase(title)}`}
          image={ogImage}
        />
        
          <div style={{margin: "0 auto",maxWidth: "1920px",minHeight: "300px", backgroundImage:`url("${posts[0].heroImage.ogimg.src}")`, backgroundRepeat: "no-repeat", backgroundPosition: "center",    backgroundSize: "cover"}}>
            <div className="blurry" style={{minHeight:"300px"}}>
              <div  className="container py-xl-5 py-lg-3 banner-container">
                <h3 className="text-wh font-weight-bold banner-title">{numberOfPosts} Posts Tagged: &ldquo;{title}&rdquo;</h3>
            </div>
          </div>
        </div>
  
      <div className="container py-xl-5 py-lg-3">
      <CardList>
      {posts.slice(skip, limit * humanPageNumber).map(post => (
        <Card {...post} key={post.id} basePath={basePath} />
      ))}
      </CardList>
      <Pagination context={pageContext} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    contentfulTag(slug: { eq: $slug }) {
      title
      id
      slug
      post {
        id
        title
        slug
        publishDate(formatString: "MMMM DD, YYYY")
        publishDateISO: publishDate(formatString: "YYYY-MM-DD")
        heroImage {
          title
          fluid(maxWidth: 1800) {
            ...GatsbyContentfulFluid_withWebp_noBase64
          }
          ogimg: resize(width: 1800) {
            src
          }
        }
        body {
          childMarkdownRemark {
            timeToRead
            html
            excerpt(pruneLength: 80)
          }
        }
      }
    }
  }
`

export default TagTemplate
