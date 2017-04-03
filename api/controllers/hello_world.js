'use strict';

const util = require('util');
let AppError = require('../../lib/app_error');

// TODO: Remove this, it is for testing
let mysqlClient = require('../../lib/mysqldb_client');
let mongoClient = require('../../lib/mongodb_client');
let redisClient = require('../../lib/cache_client');


module.exports = {
  testMysql: testMysql,
  testMongo: testMongo,
  testRedis: testRedis,
};

function testMysql(req, res, next) {

  let query = 'SELECT * FROM people';
  mysqlClient.execQuery(req.mysqlConn, query)
    .then((response) => res.json(response))
    .catch((e) => next(e));
}

function testMongo(req, res, next) {

  mongoClient.execQuery(req.mongodbConn)
    .then((response) => res.json(response))
    .catch((e) => next(e));
}

function testRedis(req, res, next) {

  req.cache.setAsync("firstName", "Sunil")
  req.cache.getAsync("firstName")
  req.cache.hmsetAsync('frameworks', {
      'javascript': 'AngularJS',
      'css': 'Bootstrap',
      'node': 'Express',
      'mytest': {
        "my_key": ['sunil', 'bharat']
    }
  });

  req.cache.hgetAllAsync('frameworks')
    .then((response) => res.json(response))
    .catch((e) => next(e));
}
