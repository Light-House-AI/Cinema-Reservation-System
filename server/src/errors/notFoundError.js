const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
