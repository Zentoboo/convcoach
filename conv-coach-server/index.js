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

// 1. Delete sessions older than specified days
app.delete('/api/sessions/older-than/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allSessions = await Session.find();
    const sessionsToDelete = allSessions.filter(session => {
      try {
        const sessionDate = new Date(session.date);
        return sessionDate < cutoffDate;
      } catch (e) {
        return false;
      }
    });

    const deleteIds = sessionsToDelete.map(s => s._id);
    if (deleteIds.length > 0) {
      await Session.deleteMany({ _id: { $in: deleteIds } });
    }

    res.json({ success: true, deletedCount: deleteIds.length });
  } catch (err) {
    console.error('Error deleting old sessions:', err);
    res.status(500).json({ error: 'Failed to delete old sessions' });
  }
});

// 2. Clear all sessions
app.delete('/api/sessions/all', async (req, res) => {
  try {
    await Session.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing sessions:', err);
    res.status(500).json({ error: 'Failed to clear sessions' });
  }
});

// 3. Delete a specific session by ID (MUST BE LAST)
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});