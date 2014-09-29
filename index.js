var Metalsmith = require('metalsmith'),
  Handlebars = require('handlebars'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks'),
  sass = require('metalsmith-sass'),
  moment = require('moment'),
  excerpts = require('metalsmith-excerpts'),
  drafts = require('metalsmith-drafts'),
  fs = require('fs');

var collectionPermalinks = {
  pages: ":title",
  posts: "blog/posts/",
  _default: ":collection/:title"
};

var findTemplate = function(config) {
  var pattern = new RegExp(config.pattern);

  return function(files, metalsmith, done) {
    for (var file in files) {
      if (pattern.test(file)) {
        var _f = files[file];
        if (!_f.template) {
          _f.template = config.templateName;
        }
      }
    }

    done();
  };
};

Handlebars.registerPartial('header',
  fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());


Handlebars.registerPartial('footer',
  fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());

Handlebars.registerHelper('blog-date', function(date) {
  var date = moment(date);
  return date.format("MMM D, YYYY");
});

Handlebars.registerHelper('nav-active', function(title, string) {
  if (title === string) {
    return "active";
  } else {
    return "";
  }
});

Metalsmith(__dirname) 
  .use(sass({ outputStyle: 'compressed' }))
  .use(drafts())
  .use(findTemplate({
    pattern: 'posts',
    templateName: 'post.hbt'
  }))
  .use(collections({
    blog: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(excerpts())
  .use(permalinks({
    pattern: ':collection/:title',
    relative: false
  }))
  .use(templates('handlebars'))
  .destination('./build')
  .build(function(err) {
    if (err) { 
      throw err;
    }
  });
