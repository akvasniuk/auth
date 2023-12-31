module.exports = {
  PORT: process.env.PORT || 3001,
  DB_URL: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/auth',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'SECRET TOKEN',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'SECRET TOKEN SECRET',
  EMAIL_TOKEN_SECRET: process.env.EMAIL_TOKEN_SECRET || 'SECRET EMAIL TOKEN',
  PASSWORD_TOKEN_SECRET: process.env.PASSWORD_TOKEN_SECRET || 'SECRET PASSWORD TOKEN',
  AUTHORIZATION: 'Authorization',
  ACCESS: 'access',
  REFRESH: 'refresh',
  ACCESS_TOKEN_TIME: '30m',
  REFRESH_TOKEN_TIME: '1d',
  EMAIL_TOKEN_TIME: '7d',
  PASSWORD_TOKEN_TIME: '30m',
  SYSTEM_EMAIL: process.env.SYSTEM_EMAIL || '12@gmail.com',
  SYSTEM_EMAIL_PASSWORD: process.env.SYSTEM_EMAIL_PASSWORD || '123456user',
  LOCALHOST_URL: 'http://localhost:3000',
  REQUEST_LIMIT: 10,
  TIME_PERIOD: 60 * 1000,
  SECRET_KEY: process.env.SECRET_KEY || '123'
};
