'use strict';

var util = require('util');
const AppError = require('../../lib/app_error');

module.exports = {
  hello: hello
};

function hello(req, res, next) {
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);
  res.json(hello);
}
