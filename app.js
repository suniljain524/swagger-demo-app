'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

let config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  require('./middlewares/swagger').init(app, swaggerExpress, { });
  require('./middlewares/error').init(app);

  var port = process.env.PORT || 10010;
  app.listen(port, () => {
    console.log('server started on http://127.0.0.1:' + port );
  })
});
