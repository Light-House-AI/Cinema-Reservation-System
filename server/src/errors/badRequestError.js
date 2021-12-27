const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class BadRequestError extends HttpError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
