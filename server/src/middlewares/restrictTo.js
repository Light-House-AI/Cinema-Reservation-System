const UnauthorizedError = require('../errors/UnauthorizedError');

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new UnauthorizedError());
    next();
  };
}

module.exports = restrictTo;
