'use strict';
var fs = require('fs');

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing


var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: require('./api/helpers/security')
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/']) {
    console.log('you should try /payments');
  }
});
