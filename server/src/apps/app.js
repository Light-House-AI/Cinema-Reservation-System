/**
 * Create express app.
 */

const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xss = require('xss-clean');

const handleErrors = require('../middlewares/handleErrors');
const NotFoundError = require('../errors/notFoundError');

const config = require('../config');

const adminRouter = require('./admin');
const customerRouter = require('./customer');
const guestRouter = require('./guest');
const managerRouter = require('./manager');

const app = express();

// Development logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Apply routes
app.use('/api/admin', adminRouter);
app.use('/api/customer', customerRouter);
app.use('/api/manager', managerRouter);
app.use('/api', guestRouter);

// Route to not found
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Error handler
app.use(handleErrors);

module.exports = app;
