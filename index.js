var Metalsmith = require('metalsmith');

Metalsmit(__dirname)
  .destination('./build')
  .build()
