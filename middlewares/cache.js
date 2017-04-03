'use strict';

module.exports = {
  init: init
};

let cacheClient = require('../lib/cache_client');
const _ = require('lodash');

function init(app) {

  let config = app.config.redis || {};
  app.use(function (req, res, next) {

    var staticUrls = req.app.config.staticUrls || [];
    if (_.find(staticUrls, function(url) {
      return url == req.url;
    })) {
      return next();
    }

    cacheClient.connectAsync(config)
        .then((cache) => {
          function onClose() {
            cache.disconnect(function (e) {
              if (e) {
                console.log("Redis Error!!", e);
                next(e);
              }
            });
          }
          req.cache = cache;
          req.on('abort', onClose);
          res.on('close', onClose);
          res.on('finish', onClose);
          next()
        })
        .catch((e) => {
          next(e);
        })
  })
}
