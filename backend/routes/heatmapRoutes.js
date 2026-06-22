const express = require('express');
const router = express.Router();
const {
  getHeatmapData,
  getPagesWithClicks
} = require('../controllers/heatmapController');

router.get('/', getHeatmapData);
router.get('/pages', getPagesWithClicks);

module.exports = router;
