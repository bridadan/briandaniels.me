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
  fs = require('fs');

var collectionTemplates = {
  posts: "post.hbt",
  electronics: "project.hbt",
  music: "music.hbt"
};

var projectTileTemplates = {
  electronics: "project_tiles/electronics.hbt",
  music: "project_tiles/music.hbt"
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

var filterByPattern = function(options) {
  var pattern = new RegExp(options.pattern);

  return function(files, metalsmith, done) {
    var filteredFiles = {};
    var reallyDone = function() {
      console.log('finished!');
      done();
    }

    for (var file in files) {
      if (pattern.test(file)) {
        filteredFiles[file] = files[file];
      }
    }

    console.log(filteredFiles);

    var func = options.func();


    func(filteredFiles, metalsmith, reallyDone);
  }
}

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
  var template = Handlebars.compile(fs.readFileSync(__dirname + '/templates/' + projectTileTemplates[project.collection], 'utf8'));
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
  .use(function (files, metalsmith, done) {
    var projects = {};

    projects.collections = [
      {id: 'electronics', name: 'Electronics'},
    {id: 'music', name: 'Music'}
    ];

    projects.items = [];

    projects.collections.forEach(function(collection) {
      metalsmith.data.collections[collection.id].forEach(function(item) {
        item._collection = collection.id;

        if (item.postUrl) {
          item._post = '/posts/' + item.postUrl
        }

        projects.items.push(item);
      });
    });

    // Sort projects most recent first
    projects.items.sort(function(a, b) {
      return b.date.getTime()-a.date.getTime();
    });

    // Populate class name fields. Add 'new' class for newest project
    for (var i = 0; i < projects.items.length; i++) {
      projects.items[i]._classNames = projects.items[i]._collection;

      if (i == 0) {
        projects.items[i]._classNames += ' new';
      }
    }

    metalsmith.data.projects = projects;

    done();
  })
  .use(templates('handlebars'))
  .use()
  .destination('./build')
  .build(function(err) {
    if (err) {
      throw err;
    }
  });
