const mongoose = require('mongoose');
const User = require('./user.model');

const statusSchema = new mongoose.Schema({
  posterID: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  content: {
    text: {
      type: String,
      maxlength: 50 // Optional: Limit text length (e.g., for tweets)
    },
    media: {
      url: String,
      type: String
    }
  },
  timePosted: {
    type: Date,
    default: Date.now 
  }
});

// Mongoose Lifecycle Hook for Automatic Removal 
statusSchema.pre('remove', async function(next) {
  const currentDate = Date.now();
  const threshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  if (currentDate - this.timePosted >= threshold) {
    // Implement logic to remove associated data (e.g., comments, likes) if needed
    next();
  } else {
    console.warn('Status removal failed: Less than 24 hours old');
    next(new Error('Removal failed: Status too recent'));
  }
});

module.exports = mongoose.model('Status', statusSchema);
