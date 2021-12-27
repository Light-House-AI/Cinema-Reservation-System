const { StatusCodes } = require('http-status-codes');
const HttpError = require('./httpError');

class MongoValidationError extends HttpError {
  constructor(err) {
    super(`Invalid parameters`, StatusCodes.BAD_REQUEST);

    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;

    this.message = message;
  }

  static isMongoValidationError(err) {
    return err.name === 'ValidationError';
  }
}

module.exports = MongoValidationError;
