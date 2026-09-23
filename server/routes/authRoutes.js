const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
  const { name, email, password, role, department, year, interests, club } = req.body;
  if (role === 'admin') {
    return res.status(403).json({ message: 'Admin signup is not allowed' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role, department, year, interests, club });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      if (role && user.role !== role) {
        return res.status(401).json({ message: 'Invalid role for this user' });
      }
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        department: user.department, year: user.year, interests: user.interests, club: user.club,
        notifications: user.notifications,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department !== undefined ? req.body.department : user.department;
      user.year = req.body.year !== undefined ? req.body.year : user.year;
      user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;
      user.notifications = req.body.notifications || user.notifications;
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role,
        department: updatedUser.department, year: updatedUser.year, interests: updatedUser.interests,
        notifications: updatedUser.notifications, token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
router.get('/debug-admin', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'admin@pillai.edu' }).select('email role password');
    res.json({
      found: !!user,
      email: user?.email || null,
      role: user?.role || null,
      passwordHashExists: !!user?.password
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
