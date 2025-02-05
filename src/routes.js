const express = require('express');
const { body, validationResult } = require('express-validator');
const mailQueue = require('./queue');
const logger = require('./logger');

const router = express.Router();

router.post(
  '/',
  body('email').isEmail(),
  body('template').isString(),
  body('subject').isString(),
  body('properties').isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Invalid request data');
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const { email, template, subject, properties } = req.body;

    if (!email || !template || !subject) {
      logger.error('Email, template e subject são obrigatórios');
      return res.status(400).json({ error: 'Email, template e subject são obrigatórios' });
    }

    if (!properties) {
      logger.warn('Properties is not provided, using empty object');
      properties = {};
    }



    try {
      await mailQueue.add('sendMail', {
        email,
        template,
        subject,
        properties: {
          ...properties,
          email
        }
      });

      logger.info(`Email queued successfully - For: ${email} - Template: ${template}`);
      res.status(202).json({ success: 'Email queued successfully' });
    } catch (error) {
      logger.error('Queue processing failed: ', error);
      res.status(500).json({ error: 'Error processing request' });
    }
  }
);

module.exports = router;
