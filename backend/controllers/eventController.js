const Event = require('../models/Event');
const { validationResult } = require('express-validator');

exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { session_id, event_type, page_url, timestamp, click } = req.body;

    const event = await Event.create({
      session_id,
      event_type,
      page_url,
      timestamp: timestamp || new Date(),
      click: click || { x: null, y: null }
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 }).limit(100);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
