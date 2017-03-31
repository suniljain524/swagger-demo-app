'use strict';

var mysql = require('mysql')


module.exports = {
  init: init
};

var initialized = false, pool;

function init(app, config) {
  if (!initialized) {
    pool = mysql.createPool(app.config.database);
    initialized = true;
  }

  app.use((req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) return next(err)
      req.conn = connection
      next()
    })
  })
}