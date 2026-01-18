const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  speed: Number,
  fillers: Number,
  fillerPercentage: Number,
  confidence: Number,
  transcript: String,
  feedback: String,
  duration: Number,
  language: String,
  // This stores the points for your time-series graph
  timeline: [{
    time: Number,
    wpm: Number,
    word: String,
    isFiller: Boolean
  }]
});

module.exports = mongoose.model('Session', SessionSchema);