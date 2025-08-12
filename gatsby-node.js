const axios = require('axios');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        src: path.join(__dirname, 'src'),
        '@src': path.join(__dirname, 'src'),
        '@common': path.join(__dirname, 'src/components/common'),
        '@components': path.join(__dirname, 'src/components'),
        '@pages': path.join(__dirname, 'src/pages'),
      },
    },
  });
};

const slugify = require('./src/components/slugify.js');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== 'MarkdownRemark') return;

  const fileNode = getNode(node.parent);
  const slugFromTitle = slugify(node.frontmatter.title);

  // sourceInstanceName defined if its a blog or case-studie
  const sourceInstanceName = fileNode.sourceInstanceName;

  // extract the name of the file because we need to sort by it's name
  // `001-blahblah`
  const fileIndex = fileNode.name.substr(2, 1);

  // create slug nodes
  createNodeField({
    node,
    name: 'slug',
    // value will be {blog||case-studies}/my-title
    value: '/' + sourceInstanceName + '/' + slugFromTitle,
  });

  // adds a posttype field to extinguish between blog and case-study
  createNodeField({
    node,
    name: 'posttype',
    // value will be {blog||case-studies}
    value: sourceInstanceName,
  });

  // if sourceInstanceName is case-studies then add the fileIndex field because we need
  // this to sort the Projects with their respective file name `001-blahblah`
  if (sourceInstanceName === 'case-studies') {
    createNodeField({
      node,
      name: 'fileIndex',
      value: fileIndex,
    });
  }
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const caseStudyTemplate = path.resolve('src/templates/case-study.js');
  const blogPostTemplate = path.resolve('src/templates/blog-post.js');
  const tagTemplate = path.resolve('src/templates/tags.js');

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              tags
            }
            fields {
              slug
              posttype
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const edges = result.data.allMarkdownRemark.edges;

  edges.forEach(({ node }) => {
    // if the posttype is case-studies then createPage with caseStudyTemplate
    // we get fileds.posttype because we created this node with onCreateNode
    if (node.fields.posttype === 'case-studies') {
      createPage({
        path: node.fields.slug,
        component: caseStudyTemplate,
        context: {
          slug: node.fields.slug,
        },
      });
    }
    // if the posttype is blog then createPage with blogPostTemplate
    else if (node.fields.posttype === 'blog') {
      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
        },
      });
    }

    // Create tag pages
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        createPage({
          path: `/tags/${slugify(tag)}/`,
          component: tagTemplate,
          context: {
            tag,
          },
        });
      });
    }
  });
};

exports.sourceNodes = ({
  actions,
  createNodeId,
  createContentDigest,
  store,
  cache,
}) => {
  const { createNode } = actions;
  const CC_PROJECTS_URI = 'https://anuraghazra.github.io/CanvasFun/data.json';

  const createCreativeCodingNode = (project, i) => {
    const node = {
      id: createNodeId(`${i}`),
      parent: null,
      children: [],
      internal: {
        type: `CreativeCoding`,
        content: JSON.stringify(project),
        contentDigest: createContentDigest(project),
      },
      ...project,
    };

    // create `allCreativeCoding` Node
    createNode(node);
  };

  // GET IMAGE THUMBNAILS
  const createRemoteImage = async (project, i) => {
    try {
      // Create a unique ID for the image node
      const imageNodeId = createNodeId(`creative-coding-image-${i}`);
      
      // Download and create the remote file node
      const fileNode = await createRemoteFileNode({
        id: imageNodeId,
        url: project.img,
        store,
        cache,
        createNode,
        createNodeId,
      });

      // Return the file node ID for reference
      return fileNode.id;
    } catch (error) {
      console.error(`Error creating remote image node for project ${i}:`, error);
      return null;
    }
  };

  // promise based sourcing
  return axios
    .get(CC_PROJECTS_URI)
    .then(async res => {
      // Use Promise.all to handle all image downloads concurrently
      const imagePromises = res.data.map((project, i) => {
        createCreativeCodingNode(project, i);
        return createRemoteImage(project, i);
      });

      await Promise.all(imagePromises);
    })
    .catch(err => {
      // just create a dummy node to pass the build if failed to fetch data
      createCreativeCodingNode(
        {
          id: '0',
          demo: '',
          img: '',
          title: 'Error while loading Data',
          src: '',
        },
        0
      );
      console.error('Error fetching creative coding projects:', err);
    });
};
