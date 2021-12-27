const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class UnauthenticatedError extends HttpError {
  constructor() {
    super('Please login to access this route', StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthenticatedError;
