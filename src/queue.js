const { Queue } = require('bullmq');
const { redisHost, redisPort, redisPassword } = require('./config');

const mailQueue = new Queue('mailQueue', {
  connection: { host: redisHost, port: redisPort, password: redisPassword },
});

module.exports = mailQueue;
