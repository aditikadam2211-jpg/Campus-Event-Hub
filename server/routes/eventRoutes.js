const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `event-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/',
  protect,
  authorize('coordinator', 'admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      const eventData = { ...req.body };

      if (req.file) {
        eventData.image = `/uploads/${req.file.filename}`;
      }

      if (eventData.highlights && typeof eventData.highlights === 'string') {
        eventData.highlights = eventData.highlights
          .split(',')
          .map(h => h.trim())
          .filter(Boolean);
      }

      eventData.creatorId = req.user._id;

      // Only admins can create already-approved events.
      eventData.status = req.user.role === 'admin' ? 'approved' : 'pending';

      // Coordinators cannot create an event for another club.
      if (req.user.role === 'coordinator') {
        if (!req.user.club) {
          return res.status(400).json({
            message: 'Coordinator is not assigned to a club'
          });
        }

        const Club = require('../models/Club');
        const club = await Club.findOne({ name: req.user.club });

        if (!club) {
          return res.status(400).json({
            message: 'Coordinator club not found'
          });
        }

        eventData.clubId = club._id;
      }

      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  '/:id',
  protect,
  authorize('coordinator', 'admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Coordinators may only modify their own events.
      if (
        req.user.role === 'coordinator' &&
        event.creatorId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          message: 'You can only edit your own events'
        });
      }

      const eventData = { ...req.body };

      // Never allow normal event editing to change approval status.
      delete eventData.status;
      delete eventData.creatorId;

      // Coordinators cannot move an event to another club.
      if (req.user.role === 'coordinator') {
        delete eventData.clubId;
      }

      if (req.file) {
        eventData.image = `/uploads/${req.file.filename}`;
      }

      if (eventData.highlights && typeof eventData.highlights === 'string') {
        eventData.highlights = eventData.highlights
          .split(',')
          .map(h => h.trim())
          .filter(Boolean);
      }

      Object.assign(event, eventData);
      await event.save();

      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  '/:id',
  protect,
  authorize('coordinator', 'admin'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Coordinators may only delete their own events.
      if (
        req.user.role === 'coordinator' &&
        event.creatorId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          message: 'You can only delete your own events'
        });
      }

      await Event.findByIdAndDelete(req.params.id);
      await Registration.deleteMany({ eventId: req.params.id });

      res.json({ message: 'Event removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid event status'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
