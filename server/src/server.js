const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Validate config
function validateConfig() {
  for (let key in config)
    if (!config[key]) logger.warn(`Missing config: ${key}`);
}

validateConfig();

// Connecting to the database
mongoose
  .connect(config.DATABASE_URL, {})
  .then(() => logger.info('DB connection successful!'))
  .catch((err) => {
    logger.error('Error connecting to the database!');
    logger.error(err);
    process.exit(1);
  });

// Running the app
const app = require('./apps/app');

const server = app.listen(config.PORT, () => {
  logger.info(`App running on port ${config.PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle app termination
process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('App terminated!');
    process.exit(0);
  });
});
