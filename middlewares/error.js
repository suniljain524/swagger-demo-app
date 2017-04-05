'use strict';

const AppError = require('../lib/app_error');
const errorCodes = require('../lib/error_codes.json');
let _ = require('lodash');

module.exports = {
  init: init
};

/*
 * make sure this is the last middleware called since it sets up the 404 NOT FOUND, which needs to be the last handler.
 */
function init(app, config) {
  config = config || {};

  // this is the NOT FOUND handler that returns the not found error object.
  app.use( (req, res, next) => {
    var staticUrls = req.app.config.swagger.staticUrls || [];
    if (_.find(staticUrls, function(url) {
      return url == req.url;
    })) {
      return next();
    }
    var err = new AppError({ error: 'not_found', message: 'Not Found' });
    return next(err);
  });

  // Error handler
  app.use((err, req, res, next) => {
    let defaultStatusCode = 500;
    if (err instanceof AppError) {
      let appError = err.message;
      if (errorCodes.customErrorCodes.hasOwnProperty(appError.error)) {
        let customError = errorCodes.customErrorCodes[appError.error];
        res.status(customError.statusCode)
          .json({error: appError.error, message: appError.message})
      }
    } else if(res.statusCode && res.statusCode !== 200) {
      res.status(res.statusCode)
        .json({error: errorCodes.httpStatusCodes[res.statusCode].status,
          message: errorCodes.httpStatusCodes[res.statusCode].message
      })
    } else {
      res.status(defaultStatusCode)
        .json({error: errorCodes.httpStatusCodes[defaultStatusCode].status,
          message: errorCodes.httpStatusCodes[defaultStatusCode].message
      })
    }
  })

}
