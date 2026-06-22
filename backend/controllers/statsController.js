const Event = require('../models/Event');

exports.getStats = async (req, res) => {
  try {
    const totalSessions = await Event.distinct('session_id');

    const totalPageViews = await Event.countDocuments({
      event_type: 'page_view'
    });

    const totalClicks = await Event.countDocuments({
      event_type: 'click'
    });

    const uniquePages = await Event.distinct('page_url');

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEvents = await Event.countDocuments({
      timestamp: { $gte: last24Hours }
    });

    res.status(200).json({
      success: true,
      data: {
        total_sessions: totalSessions.length,
        total_page_views: totalPageViews,
        total_clicks: totalClicks,
        unique_pages: uniquePages.length,
        recent_events_24h: recentEvents
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
