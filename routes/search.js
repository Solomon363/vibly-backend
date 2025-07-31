const express = require('express');
const router = express.Router();
const Video = require('../models/Video'); // adjust path if needed

// GET /api/search?q=keyword
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await Video.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [query.toLowerCase()] } }
      ]
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
