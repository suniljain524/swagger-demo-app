'use strict';

var mysql = require('mysql')
var mongodb = require('mongodb').MongoClient;

module.exports = {
  init: init
};

var initialized = false, mysqlConn, mongodbConn;

function init(app) {
  if (!initialized) {
    mysqlConn = mysql.createPool(app.config.mysqlDatabase);

    // check mysql database connection
    mysqlConn.getConnection((err, connection) => {
      if (err) throw(err);
      connection.release();
    });

    mongodb.connect(app.config.mongoDatabase.url, function(err, database) {
      mongodbConn = database
    });
    initialized = true;
  }

  app.use((req, res, next) => {
    req.mysqlConn = mysqlConn;
    req.mongodbConn = mongodbConn;
    next()
  })
}
