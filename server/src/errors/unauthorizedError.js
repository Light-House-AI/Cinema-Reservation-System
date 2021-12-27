const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class UnauthorizedError extends HttpError {
  constructor() {
    super(
      'Your account is not authorized to access the requested resource.',
      StatusCodes.FORBIDDEN
    );
  }
}

module.exports = UnauthorizedError;
