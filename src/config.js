require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mailUser: process.env.MAIL,
  mailPass: process.env.MAIL_PASSWORD,
  mailFrom: process.env.MAIL_FROM,
  smtpSecure: process.env.SMTP_SECURE || false,
  redisHost: process.env.REDIS_HOST || 'redis',
  redisPort: process.env.REDIS_PORT || 6379,
  redisPassword: process.env.REDIS_PASSWORD || '',
};
