const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    // If admin, return all. If student/coordinator, return only theirs?
    // Actually, dashboard needs to see all registrations for metrics.
    // We'll return all registrations if admin or coordinator, or just for the student.
    let filter = {};
    if (req.user.role === 'student') {
      filter.userId = req.user._id;
    }
    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.seatsFilled >= event.seatLimit) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const existing = await Registration.findOne({ userId: req.user._id, eventId });
    if (existing) {
      return res.status(400).json({ message: 'Already registered' });
    }

    const registration = await Registration.create({
      userId: req.user._id,
      eventId
    });

    event.seatsFilled += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
