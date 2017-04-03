'use strict';

const util = require('util');
let AppError = require('../../lib/app_error');

// TODO: Remove this, it is for testing
let mysqlClient = require('../../lib/mysqldb_client');
let mongoClient = require('../../lib/mongodb_client');


module.exports = {
  testMysql: testMysql,
  testMongo: testMongo
};

function testMysql(req, res, next) {

  // TODO: Remove query, it is for testing mysql connection
  let query = 'SELECT * FROM people';
  mysqlClient.execQuery(req.mysqlConn, query)
    .then((rows) => {
      res.json(rows);
    })
    .catch((e) => {
      next(e);
    })
}

function testMongo(req, res, next) {

  // TODO: Is for testing mongodb connection
  mongoClient.execQuery(req.mongodbConn)
    .then((rows) => {
      res.json(rows);
    })
    .catch((e) => {
      next(e);
    })
}
