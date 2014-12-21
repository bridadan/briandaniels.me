var Metalsmith = require('metalsmith'),
  Handlebars = require('handlebars'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks'),
  paginate = require('metalsmith-pagination');
  sass = require('metalsmith-sass'),
  moment = require('moment'),
  excerpts = require('metalsmith-excerpts'),
  drafts = require('metalsmith-drafts'),
  fs = require('fs');

var collectionTemplates = {
  posts: "post.hbt",
  electronics: "page.hbt",
  music: "music.hbt"
};

var findTemplate = function(templates) {
  var collections = Object.keys(templates);
    patterns = {};

  collections.forEach(function(collection) {
    patterns[collection] = new RegExp(collection);
  });

  return function(files, metalsmith, done) {
    for (var file in files) {
      for (var i = 0; i < collections.length; i++) {
        var collection = collections[i];
        if (patterns[collection].test(file)) {
          var _f = files[file];
          if (!_f.template) {
            _f.template = templates[collection];
          }
          break;
        }
      }
    };

    done();
  };
};

Handlebars.registerHelper('debug', function(data) {
  console.log(data);
});

Handlebars.registerPartial('header',
  fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());

Handlebars.registerPartial('footer',
  fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());

Handlebars.registerPartial('soundcloud',
  fs.readFileSync(__dirname + '/templates/partials/soundcloud.hbt').toString());

Handlebars.registerHelper('blog-date', function(date) {
  var date = moment(date);
  return date.format("MMM D, YYYY");
});

Handlebars.registerHelper('project', function(project) {
  var template = Handlebars.compile(fs.readFileSync(__dirname + '/templates/projects/' + project.collection + '.hbt', 'utf8'));
  return new Handlebars.SafeString(template(project));
});

Handlebars.registerHelper('nav-active', function(title, string) {
  if (title === string) {
    return "active";
  } else {
    return "";
  }
});

Handlebars.registerHelper('limit', function( collection, limit, start ) {
  if (!start || !limit) {
    return collection;
  } else {
    return collection.slice( start, limit + 1 );
  }
});

Metalsmith(__dirname) 
  .use(sass({ outputStyle: 'compressed' }))
  .use(drafts())
  .use(findTemplate(collectionTemplates))
  .use(collections({
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    },
    electronics: {
      pattern: 'content/electronics/*.md',
      sortBy: 'date',
      reverse: true
    },
    music: {
      pattern: 'content/music/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(excerpts())
  .use(paginate({
    'collections.posts': {
      perPage: 10,
      template: 'blog.hbt',
      first: 'blog/index.html',
      path: 'blog/page/:num/index.html',
      pageMetadata: {
        title: 'Blog'
      }
    }
  }))
  .use(permalinks({
    pattern: ':collection/:title',
    relative: false
  }))
  .use(function (files, metalsmith, done) {
    var collections = ['electronics', 'music'];

    metalsmith.data.projects = [];

    collections.forEach(function(collection) {
      metalsmith.data.collections[collection].forEach(function(project) {
        project._collection = collection;
        metalsmith.data.projects.push(project);
      });
    });

    // Sort projects most recent first
    metalsmith.data.projects.sort(function(a, b) {
      return b.date.getTime()-a.date.getTime();
    });

    // Populate class name fields. Add 'new' class for newest project
    for (var i = 0; i < metalsmith.data.projects.length; i++) {
      metalsmith.data.projects[i]._classNames = metalsmith.data.projects[i]._collection;
      
      if (i == 0) {
        metalsmith.data.projects[i]._classNames += ' new';
      }
    }

    done();
  })
  .use(templates('handlebars'))
  .destination('./build')
  .build(function(err) {
    if (err) { 
      throw err;
    }
  });
