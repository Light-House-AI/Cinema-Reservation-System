const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  NUM_LOGIN_REQUESTS_PER_HOUR: process.env.NUM_LOGIN_REQUESTS_PER_HOUR || 10,
};

module.exports = config;
