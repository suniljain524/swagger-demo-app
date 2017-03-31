module.exports = AppError;

function AppError(message, extra) {
  Error.call(this); //super constructor
  Error.captureStackTrace(this, this.constructor);
  this.name = 'AppError';
  this.message = message;
  this.extra = extra;
};


require('util').inherits(AppError, Error);
