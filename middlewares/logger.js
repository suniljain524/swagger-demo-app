const winston = require('winston');

module.exports = {
  init: init
};

function init(app) {

  app.use((req, res, next) => {
    // Log request data and register event to log response.
    var logger  = req.logger = logger = new (winston.Logger)({
                  transports: [
                    new (winston.transports.Console)({
                      prettyPrint: true
                    }),
                    new (winston.transports.File)({ filename: 'somefile.log' }) // TODO: Read this from config.
                  ]
                });

    winston.cli();
    winston.addColors({
      silly: 'magenta',
      debug: 'cyan',
      info: 'green',
      warn: 'yellow',
      error: 'red'
    });

    logger.cli();

    logger.info({
      requestStarted: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body
      }
    });
    res.on('close', function () {
      logger.info({
        requestTerminated: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          query: req.query
        }
      });
    });
    res.on('finish', function () {
      logger.info({
        requestFinished: {
          statusCode: res.statusCode,
          method: req.method,
          url: req.url,
          headers: req.headers,
          query: req.query
        }
      });
    });
    next();
  });
}
