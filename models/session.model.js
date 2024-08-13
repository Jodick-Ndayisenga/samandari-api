const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' }, // Session expires after 1 day
  ip: { type: String, required: true },
  failedLoginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);
