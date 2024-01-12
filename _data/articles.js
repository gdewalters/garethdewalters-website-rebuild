// import the client we just created
require('dotenv').config();
const contentful = require('contentful');

const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CTFL_SPACE,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = async () => {
	// create a request for all entries that match our post type. 
	// we can use the `order` property to sort them reverse-chronologically by their published date.
  const articles = await client.getEntries({
    content_type: 'composeArticle'
  });
  return articles.items;
};