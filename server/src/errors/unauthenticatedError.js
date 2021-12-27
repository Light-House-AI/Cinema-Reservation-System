const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class UnauthenticatedError extends HttpError {
  constructor() {
    super(
      'You are unauthorized to access the requested resource. Please log in.',
      StatusCodes.UNAUTHORIZED
    );
  }
}

module.exports = UnauthenticatedError;
