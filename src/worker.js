const { Worker } = require('bullmq');
const { sendMail, verifyTransporter } = require('./mailer');
const logger = require('./logger');
const { redisHost, redisPort, redisPassword } = require('./config');
const os = require('os');
const crypto = require('crypto');


const workerId = crypto.randomBytes(4).toString('hex');
const hostname = os.hostname();
const workerIdentifier = `${hostname}-${workerId}`;

console.log(`[WORKER] Starting worker, with PID: ${workerIdentifier}`);
logger.info(`[WORKER] Starting worker, with PID: ${workerIdentifier}`);



const mailWorker = new Worker(
  'mailQueue',
  async (job) => {
    console.log(`[WORKER-${workerIdentifier}] Processing email for ${job.data.email}`);
    logger.info(`[WORKER-${workerIdentifier}] Processing email for ${job.data.email}`);
    await verifyTransporter();
    await sendMail(job.data);

  },

  {
    connection: { host: redisHost, port: redisPort, password: redisPassword },
  }
);

mailWorker.on('completed', (job) => {
  logger.info(`[WORKER-${workerIdentifier}] Email queued completed successfully for ${job.data.email}, Job ID: ${job.id}`);
});


mailWorker.on('failed', (job, err) => {
  logger.error(`[WORKER-${workerIdentifier}] Failed to send email to ${job.data.email}: ${err.message}, Job ID: ${job.id}`);
});
