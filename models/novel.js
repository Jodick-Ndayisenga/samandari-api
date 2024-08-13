const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

const readingSchema = new mongoose.Schema({
  userId: { type: String, required: true }
});

const novelSchema = new mongoose.Schema({
  title: String,
  genres: [String],
  language: String,
  author: String,
  publicationYear: Number,
  filename: String,
  uploadDate: { type: Date, default: Date.now },
  ratings: [ratingSchema],
  readings: [readingSchema],
  rating: { type: Number, default: 0 },
  readers: { type: Number, default: 0 }
});

novelSchema.methods.calculateRating = function () {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.rating = sum / this.ratings.length;
  } else {
    this.rating = 0;
  }
};

novelSchema.methods.calculateReaders = function () {
  this.readers = this.readings.length;
};

novelSchema.pre('save', function (next) {
  this.calculateRating();
  this.calculateReaders();
  next();
});

const NOVEL = mongoose.model('NOVEL', novelSchema);

const addRating = async (novelId, userId, rating) => {
  const novel = await NOVEL.findById(novelId);
  
  const existingRatingIndex = novel.ratings.findIndex(r => r.userId === userId);
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    novel.ratings[existingRatingIndex].rating = rating;
  } else {
    // Add new rating
    novel.ratings.push({ userId, rating });
  }

  // Recalculate the average rating
  novel.calculateRating();
  await novel.save();
};

const addReading = async (novelId, userId) => {
  const novel = await NOVEL.findById(novelId);
  if (!novel.readings.some(reading => reading.userId === userId)) {
    novel.readings.push({ userId });
  }
  novel.calculateReaders();
  await novel.save();
};

module.exports = { NOVEL, addRating, addReading };
