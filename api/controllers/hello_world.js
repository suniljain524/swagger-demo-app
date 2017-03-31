'use strict';

var util = require('util');
const AppError = require('../../lib/app_error');

module.exports = {
  hello: hello
};

function hello(req, res, next) {
  
  // TODO: Run query for testing
  req.conn.query('SELECT * from people', function (err, rows) {
    if (err) throw err
    console.log('The solution is: ', rows)
  })

  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);
  res.json(hello);
}
