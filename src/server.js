const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { port } = require('./config');
const logger = require('./logger');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/email', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  logger.info(`Server running on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    reason,
    promise
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully...');
  process.exit(0);
});