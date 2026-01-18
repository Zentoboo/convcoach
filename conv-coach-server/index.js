const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/convocoach')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database error:', err));

// Session Schema with timeline support
const SessionSchema = new mongoose.Schema({
  date: String,
  speed: Number,
  fillers: Number,
  fillerPercentage: Number,
  confidence: Number,
  transcript: String,
  feedback: String,
  duration: Number,
  language: String,
  timeline: [{
    time: Number,
    wpm: Number,
    word: String,
    isFiller: Boolean
  }]
});

const Session = mongoose.model('Session', SessionSchema);

// Save a new session
app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error('Error saving session:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get all sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ _id: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));