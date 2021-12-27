const config = require('./config');
const { format, createLogger, transports } = require('winston');

const formatMessage = ({ level, message, timestamp, stack }) => {
  if (stack) return `${timestamp} - ${level}: ${message} \n${stack}`;
  return `${timestamp} - ${level}: ${message}`;
};

const consoleTransport = new transports.Console({
  format: format.combine(format.colorize(), format.printf(formatMessage)),
});

const logger = new createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.timestamp()
  ),
  transports: [consoleTransport],
});

module.exports = logger;
