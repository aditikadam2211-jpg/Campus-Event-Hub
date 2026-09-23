const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  category: String,
  venue: String,
  startTime: Date,
  endTime: Date,
  seatLimit: { type: Number, required: true },
  seatsFilled: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  image: String,
  description: String,
  highlights: [String],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
