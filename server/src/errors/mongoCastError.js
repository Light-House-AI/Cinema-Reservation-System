const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class MongoCastError extends HttpError {
  constructor(err) {
    super(`Invalid ${err.path}: ${err.value}`, StatusCodes.BAD_REQUEST);
  }

  static isMongoCastError(err) {
    return err.name === 'CastError';
  }
}

module.exports = MongoCastError;
