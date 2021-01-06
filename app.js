"use strict";

const devConfig = require("./config/dev_config.json");
const prodConfig = require("./config/prod_config.json");
let SwaggerExpress = require("swagger-express-mw");
let app = require("express")();
let helmet = require("helmet");
let _ = require("lodash");
let env = require("./env");

module.exports = app; // for testing

app.use(helmet());

let config = (app.config = {
  appRoot: __dirname, // required config
});

app.use("/health-check", require("./routes/health"));

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  _.extend(app.config, swaggerExpress.runner.config);

  process.env.SERVER_ENVIRONMENT == "prod"
    ? _.extend(app.config, prodConfig)
    : _.extend(app.config, devConfig);

  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());
  require("./middlewares/logger").init(app);
  require("./middlewares/db").init(app);
  require("./middlewares/cache").init(app);
  require("./middlewares/swagger").init(app, swaggerExpress, {});
  require("./middlewares/error").init(app);

  var port = process.env.PORT || 10010;
  app.listen(port, () => {
    console.log("server started on http://127.0.0.1:" + port);
  });
});
