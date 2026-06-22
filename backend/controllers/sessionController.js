const Event = require('../models/Event');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          total_events: { $sum: 1 },
          first_event_time: { $min: '$timestamp' },
          last_event_time: { $max: '$timestamp' },
          page_urls: { $addToSet: '$page_url' }
        }
      },
      {
        $project: {
          _id: 0,
          session_id: '$_id',
          total_events: 1,
          first_event_time: 1,
          last_event_time: 1,
          session_duration: {
            $divide: [
              { $subtract: ['$last_event_time', '$first_event_time'] },
              1000
            ]
          },
          page_count: { $size: '$page_urls' }
        }
      },
      {
        $sort: { first_event_time: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ session_id: sessionId })
      .sort({ timestamp: 1 });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
