const Event = require('../models/Event');

exports.getHeatmapData = async (req, res) => {
  try {
    const { page } = req.query;

    if (!page) {
      return res.status(400).json({
        success: false,
        message: 'Page URL parameter is required'
      });
    }

    const clicks = await Event.find({
      event_type: 'click',
      page_url: page
    }).select('click.x click.y timestamp session_id');

    const heatmapData = clicks.map(click => ({
      x: click.click.x,
      y: click.click.y,
      timestamp: click.timestamp,
      session_id: click.session_id
    }));

    res.status(200).json({
      success: true,
      count: heatmapData.length,
      page_url: page,
      data: heatmapData
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getPagesWithClicks = async (req, res) => {
  try {
    const pages = await Event.aggregate([
      {
        $match: { event_type: 'click' }
      },
      {
        $group: {
          _id: '$page_url',
          click_count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          page_url: '$_id',
          click_count: 1
        }
      },
      {
        $sort: { click_count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
