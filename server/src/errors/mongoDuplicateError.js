const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class MongoDuplicateError extends HttpError {
  constructor(err) {
    super('Duplicate values', StatusCodes.BAD_REQUEST);

    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please use another value`;

    this.message = message;
  }

  static isMongoDuplicateError(err) {
    return err.code === 11000;
  }
}

module.exports = MongoDuplicateError;
