require('dotenv').config()

const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

// Contentful
const contentful = require("contentful");
const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CTFL_SPACE,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CTFL_ACCESSTOKEN
});
const {
    documentToHtmlString
} = require('@contentful/rich-text-html-renderer');

// filters
const pluginDrafts = require("./_utils/eleventy.config.drafts.js");
const pluginImages = require("./_utils/eleventy.config.images.js");
const filters = require("./_utils/eleventy.config.filters.js");

// -----------------------------------------------------------------
// Enable Tailwind
// -----------------------------------------------------------------

const tailwind = require('tailwindcss');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// -----------------------------------------------------------------
// End Tailwind
// -----------------------------------------------------------------

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		'./node_modules/alpinejs/dist/cdn.js': './assets/js/alpine.js',
		'./node_modules/preline/dist/preline.js': './assets/js/preline.js',
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName])
    })

	eleventyConfig.addFilter("renderRichTextAsHtml", (value) =>
    	documentToHtmlString(value)
  	);

	// Short codes
	eleventyConfig.addShortcode("version", function () {
		return String(Date.now());
	});

	// -----------------------------------------------------------------
	// Tailwind asynchronous filter
	// -----------------------------------------------------------------

	const postcssFilter = (cssCode, done) => {
		// we call PostCSS here.
		postCss([tailwind(require('./tailwind.config')), autoprefixer(), cssnano({ preset: 'default' })])
			.process(cssCode, {
				// path to our CSS file
				from: './_includes/css-framework/tailwind.css'
			})
			.then(
				(r) => done(null, r.css),
				(e) => done(e, null)
			);
	};

	eleventyConfig.addWatchTarget('./_includes/css-framework/tailwind.css');
	eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);

	// -----------------------------------------------------------------
	// End Tailwind
	// -----------------------------------------------------------------

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	// Base configuration
	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html"
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			output: "_site",
			includes: "../_includes",  // default: "_includes"
			data: "../_data"          // default: "_data"

		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
