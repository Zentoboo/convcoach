require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not defined in .env file!");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/convocoach')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database error:', err));

// 2. SCHEMAS & MODELS
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
  }],
  topic: { type: String, default: '' },
  aiFeedback: { type: String, default: '' }
});

const SettingsSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user' },
  selectedLanguage: { type: String, default: 'en-US' },
  customFillers: [String]
});

const Session = mongoose.model('Session', SessionSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

// 3. SETTINGS ROUTES
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: 'default_user' });
    if (!settings) {
      settings = new Settings({
        selectedLanguage: 'en-US',
        customFillers: ['um', 'uh', 'like', 'you know']
      });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const { selectedLanguage, customFillers } = req.body;
    const settings = await Settings.findOneAndUpdate(
      { userId: 'default_user' },
      { selectedLanguage, customFillers },
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 4. SESSION ROUTES
app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ _id: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.delete('/api/sessions/all', async (req, res) => {
  try {
    await Session.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear sessions' });
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze-with-gemini', async (req, res) => {
  try {
    const { transcript, speed, fillerPercentage, confidence, topic } = req.body;
    console.log("Starting Gemini analysis for topic:", topic);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert communication coach. Your feedback is constructive, data-driven, and uses professional markdown formatting."
    });

    const prompt = `
      SPEECH METRICS:
      - Speed: ${speed} WPM
      - Fillers: ${fillerPercentage}%
      - Confidence: ${confidence}%
      - Topic: "${topic}"
      
      TRANSCRIPT: "${transcript}"
      
      Analyze:
      1. Topic Relevance
      2. Content Quality
      3. Delivery Feedback (based on metrics)
      4. 2-3 Practical Next Steps
    `;

    console.log("Sending request to Gemini API...");
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), 20000)
      )
    ]);
    console.log("Received response from Gemini API");

    const aiFeedback =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result.response.text();
    res.json({ aiFeedback });
  } catch (error) {
    console.error("Gemini analysis error full:", JSON.stringify(error, null, 2));
    res.status(500).json({
      error: "AI analysis failed",
      details: error.message || error
    });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// 5. START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));