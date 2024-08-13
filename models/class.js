
// models/pdfModel.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  category: String,
  year: Number,
  grade: String,
  section: String,
  subject: String,
  school: String,
  isAnswerManual: {
    type: Boolean,
    default: false
  },
  date: Date,
  filename: String,
  uploadDate: { type: Date, default: Date.now }
});

const CLASS = mongoose.model('CLASS', classSchema);

module.exports = CLASS;
