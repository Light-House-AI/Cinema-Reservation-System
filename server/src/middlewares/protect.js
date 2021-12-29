const jwt = require('jsonwebtoken');
const config = require('../config');
const catchAsync = require('../utils/catchAsync');

const UnauthenticatedError = require('../errors/UnauthenticatedError');
const NotFoundError = require('../errors/NotFoundError');

const User = require('../models/user');

const protect = catchAsync(async (req, res, next) => {
  let token;

  // Getting token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verifying token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    throw new UnauthenticatedError();
  }

  // Check if the user still exists
  const user = await User.findById(decodedToken.id);
  if (!user) throw new NotFoundError('The user with this token does not exist');

  // Grant access to protected route
  req.user = user;
  next();
});

module.exports = protect;
