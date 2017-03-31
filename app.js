'use strict';

let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
let helmet = require('helmet');
let _ = require('lodash');
module.exports = app; // for testing

app.use(helmet());

let config = app.config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  _.extend(app.config, swaggerExpress.runner.config);

  app.config.database = {
    user: app.config.database.user,
    password: app.config.database.password,
    database: app.config.database.database,
    host: app.config.database.host,
    port: app.config.database.port,
    pool: {
      min: app.config.database.pool.min || 1,
      max: app.config.database.pool.max || 1
    }
  };
  require('./middlewares/db').init(app, { });
  require('./middlewares/swagger').init(app, swaggerExpress, { });
  require('./middlewares/error').init(app);

  var port = process.env.PORT || 10010;
  app.listen(port, () => {
    console.log('server started on http://127.0.0.1:' + port );
  })
});
