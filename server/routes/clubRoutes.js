const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
