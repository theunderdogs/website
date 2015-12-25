//https://gist.github.com/justmoon/15511f92e5216fa2624b
'use strict';

module.exports = function CustomError(errorMetadata) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = errorMetadata.message;
  this.code = errorMetadata.code;
};

require('util').inherits(module.exports, Error);