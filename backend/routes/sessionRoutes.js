const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionById
} = require('../controllers/sessionController');

router.get('/', getAllSessions);
router.get('/:sessionId', getSessionById);

module.exports = router;
