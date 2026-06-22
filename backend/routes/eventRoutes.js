const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEvent,
  getEvents
} = require('../controllers/eventController');

const eventValidation = [
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('event_type').isIn(['page_view', 'click']).withMessage('Invalid event type'),
  body('page_url').notEmpty().withMessage('Page URL is required'),
  body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format')
];

router.post('/', eventValidation, createEvent);
router.get('/', getEvents);

module.exports = router;
