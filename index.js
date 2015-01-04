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
  metallic = require('metalsmith-metallic'),
  msj = require('metalsmith-json'),
  ignore = require('metalsmith-ignore'),
  fs = require('fs');

var collectionTemplates = {
  posts: "post.hbt",
  electronics: "project.hbt",
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
  var template = Handlebars.compile(fs.readFileSync(__dirname + '/templates/' + project._template, 'utf8'));
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
  .use(msj({
    key: 'data'
  }))
  .use(function (files, metalsmith, done) {
    var projects = { items: [] },
      types = {},
      pattern = new RegExp('content/projects/[^/]*/.*'),
      item,
      folders,
      type;

    if (!('content/projects/config.json' in files)) {
      console.log('Must provide content/projects/config.json file');
      done();
    } else {
      projects.types = files['content/projects/config.json'].data;

      projects.types.forEach(function(key) {
        types[key.id] = key;
      });
    }

    for (var file in files) {
      if (pattern.test(file)) {
        item = files[file].data;
        folders = file.split('/');

        type = folders[folders.length - 2];

        if (!(type in projects)) {
          projects[type] = [];
        }

        item._type = type;
        item._template = types[type].projectTileTemplate;
        item.date = new Date(item.date);

        if (item.postUrl) {
          item._post = '/posts/' + item.postUrl;
        }

        projects[type].push(item);
        projects.items.push(item);
      }
    }

    // Sort projects most recent first
    projects.items.sort(function(a, b) {
      return b.date.getTime()-a.date.getTime();
    });

    // Populate class name fields. Add 'new' class for newest project
    for (var i = 0; i < projects.items.length; i++) {
      projects.items[i]._classNames = projects.items[i]._type;

      if (i == 0) {
        projects.items[i]._classNames += ' new';
      }
    }

    metalsmith.data.projects = projects;

    done();
  })
  .use(ignore('content/projects/*'))
  .use(drafts())
  .use(findTemplate(collectionTemplates))
  .use(collections({
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(metallic())
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
  .use(templates('handlebars'))
  .use()
  .destination('./build')
  .build(function(err) {
    if (err) {
      throw err;
    }
  });
