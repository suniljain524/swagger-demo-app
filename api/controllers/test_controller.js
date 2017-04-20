
'use strict';

const util = require('util');
const fs = require("fs");
const priveKey = "Encrypt@token#$" // TODO: Move it to config.
let AppError = require('../../lib/app_error');

// TODO: Remove this, it is for testing
let mysqlClient = require('../../lib/mysqldb_client');
let mongoClient = require('../../lib/mongodb_client');
let redisClient = require('../../lib/cache_client');

var jwt    = require('jsonwebtoken');

module.exports = {
  testMysql: testMysql,
  testMongo: testMongo,
  testRedis: testRedis,
  imageUpload: imageUpload,
  testToken: testToken,
  getToken: getToken
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

function imageUpload(req, res, next) {

  let reqPath = req.swagger.params.upfile.originalValue;
  var path = './uploads/';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFile( path + reqPath.originalname, reqPath.buffer , (err) => {
    if (err) {
      var err = { message: 'File not uploaded' };
      return next(err);
    }
    res.json("File uploaded");
  });
}

function getToken(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Add logic to check username and password from db.
  let expiresInSeconds = 60*30;
  // if user is found and password is right
  // create a token
  var token = jwt.sign({username: "sunil", role: "admin"}, priveKey, {
    expiresIn: expiresInSeconds // expires in 1800 seconds
  });

  // return the information including token as JSON
  res.json({
    token: token,
    expires_in: expiresInSeconds
  });

}

function testToken(req, res, next) {
  if (req.headers.authorization) {
    var match = req.headers.authorization.match(/Bearer (.+)/i);
    if (match) {
      req.accessToken = match[1];
        // verifies secret and checks exp
      jwt.verify(req.accessToken, priveKey, function(err, decoded) {
        if (err) {
          next(new AppError({error: "unauthorized", message: "unauthorized"}));
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          return res.json({status: "OK."});
        }
      });
    }
  } else {
    next(new AppError({error: "unauthorized", message: "unauthorized"}));
  }
}
