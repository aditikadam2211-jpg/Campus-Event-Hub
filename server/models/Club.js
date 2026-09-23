const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinatorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  color: { type: String, default: 'indigo' }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
