'use strict';

const util = require('util');
let AppError = require('../../lib/app_error');

// TODO: Remove this, it is for testing
let dbClient = require('../../lib/db_client');


module.exports = {
  hello: hello
};

function hello(req, res, next) {

  // TODO: Remove query, it is for testing
  let query = 'SELECT * FROM people';
  dbClient.execQuery(req.conn, query)
    .then((rows) => {
      res.json(rows);
    })
    .catch((e) => {
      next(e);
    })
}
