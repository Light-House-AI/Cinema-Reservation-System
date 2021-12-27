const { StatusCodes } = require('http-status-codes');

const logger = require('../logger');

const MongoCastError = require('../errors/mongoCastError');
const MongoDuplicateError = require('../errors/mongoDuplicateError');
const MongoValidationError = require('../errors/mongoValidationError');

function handleErrors(err, req, res, next) {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  // Handle MongoDB errors
  if (MongoCastError.isMongoCastError(err)) err = new MongoCastError(err);

  if (MongoValidationError.isMongoValidationError(err))
    err = new MongoValidationError(err);

  if (MongoDuplicateError.isMongoDuplicateError(err))
    err = new MongoDuplicateError(err);

  // Send error to client if it's a trusted error
  if (err.isOperational)
    return res.status(err.statusCode).json(err.serializeErrors());

  // Otherwise log the error and send a generic error message
  logger.error(err);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong',
  });
}

module.exports = handleErrors;
