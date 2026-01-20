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
  aiFeedback: { type: String, default: '' },
  // Enhanced scoring fields
  bandScores: {
    overall: { type: Number, min: 0, max: 9 },
    fluencyCoherence: { type: Number, min: 0, max: 9 },
    lexicalResource: { type: Number, min: 0, max: 9 },
    grammaticalRange: { type: Number, min: 0, max: 9 },
    pronunciation: { type: Number, min: 0, max: 9 }
  },
  toeflScores: {
    delivery: { type: Number, min: 0, max: 4 },
    languageUse: { type: Number, min: 0, max: 4 },
    topicDevelopment: { type: Number, min: 0, max: 4 }
  },
  rubricBreakdown: {
    clarity: { score: Number, feedback: String, maxScore: Number },
    relevance: { score: Number, feedback: String, maxScore: Number },
    structure: { score: Number, feedback: String, maxScore: Number },
    engagement: { score: Number, feedback: String, maxScore: Number },
    vocabulary: { score: Number, feedback: String, maxScore: Number },
    grammar: { score: Number, feedback: String, maxScore: Number }
  },
  detailedRubric: { type: String, default: '' }
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

app.delete('/api/sessions/older-than/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days);
    if (isNaN(days) || days < 0) {
      return res.status(400).json({ error: 'Invalid number of days' });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Delete sessions where date field is older than cutoff date
    // Note: Sessions store date as String, so we need to parse and compare
    const result = await Session.deleteMany({
      date: { $lt: cutoffDate.toISOString().split('T')[0] }
    });

    res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Error deleting old sessions:', err);
    res.status(500).json({ error: 'Failed to delete old sessions' });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze-with-gemini', async (req, res) => {
  try {
    const { transcript, speed, fillerPercentage, confidence, topic } = req.body;
    console.log("Starting enhanced Gemini analysis for topic:", topic);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert communication coach specializing in IELTS/TOEFL evaluation. Provide structured scoring with detailed rubric analysis. Always respond in valid JSON format."
    });

    const prompt = `
      SPEECH METRICS:
      - Speed: ${speed} WPM (optimal: 150-190 WPM)
      - Fillers: ${fillerPercentage}% (optimal: <5%)
      - Confidence: ${confidence}% (optimal: >75%)
      - Topic: "${topic}"
      
      TRANSCRIPT: "${transcript}"
      
      Provide comprehensive evaluation using IELTS/TOEFL rubrics. Respond with ONLY valid JSON:

      {
        "bandScores": {
          "overall": <0-9>,
          "fluencyCoherence": <0-9>,
          "lexicalResource": <0-9>,
          "grammaticalRange": <0-9>,
          "pronunciation": <0-9>
        },
        "toeflScores": {
          "delivery": <0-4>,
          "languageUse": <0-4>,
          "topicDevelopment": <0-4>
        },
        "rubricBreakdown": {
          "clarity": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10},
          "relevance": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10},
          "structure": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10},
          "engagement": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10},
          "vocabulary": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10},
          "grammar": {"score": <0-10>, "feedback": "<brief feedback>", "maxScore": 10}
        },
        "detailedRubric": "<markdown formatted detailed analysis with sections for IELTS criteria, TOEFL criteria, and presentation skills>",
        "aiFeedback": "<traditional feedback summary>"
      }

      IELTS Scoring Guide:
      - Band 9: Expert user (fluent, precise, no errors)
      - Band 8: Very good user (fluent, occasional errors)
      - Band 7: Good user (operational command, some errors)
      - Band 6: Competent user (effective communication, noticeable errors)
      - Band 5: Modest user (basic command, frequent errors)
      - Band 4: Limited user (basic competence, breakdown in communication)
      - Band 3: Extremely limited user (frequent breakdown)
      - Band 2: Intermittent user (great difficulty)
      - Band 1: Non-user (no real communication ability)
      - Band 0: Did not attempt

      TOEFL Scoring Guide:
      - 4: Generally well-paced, clear expression, effective development
      - 3: Mostly clear pacing, some difficulties, adequate development
      - 2: Uneven pace, difficult to understand, limited development
      - 1: Slow/hesitant, very difficult to understand, minimal development

      Consider all aspects: fluency, vocabulary range, grammatical accuracy, pronunciation clarity, topic relevance, content organization, and overall effectiveness.
    `;

    console.log("Sending structured scoring request to Gemini API...");
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), 30000)
      )
    ]);
    console.log("Received structured response from Gemini API");

    let responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || result.response.text();
    
    // Clean and parse JSON response
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    let structuredAnalysis;
    try {
      structuredAnalysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", responseText);
      // Fallback to simple feedback if JSON parsing fails
      structuredAnalysis = {
        aiFeedback: responseText,
        bandScores: { overall: 0, fluencyCoherence: 0, lexicalResource: 0, grammaticalRange: 0, pronunciation: 0 },
        toeflScores: { delivery: 0, languageUse: 0, topicDevelopment: 0 },
        rubricBreakdown: {
          clarity: { score: 0, feedback: "Analysis unavailable", maxScore: 10 },
          relevance: { score: 0, feedback: "Analysis unavailable", maxScore: 10 },
          structure: { score: 0, feedback: "Analysis unavailable", maxScore: 10 },
          engagement: { score: 0, feedback: "Analysis unavailable", maxScore: 10 },
          vocabulary: { score: 0, feedback: "Analysis unavailable", maxScore: 10 },
          grammar: { score: 0, feedback: "Analysis unavailable", maxScore: 10 }
        },
        detailedRubric: "Detailed rubric analysis unavailable due to processing error."
      };
    }

    res.json(structuredAnalysis);
  } catch (error) {
    console.error("Enhanced Gemini analysis error:", JSON.stringify(error, null, 2));
    res.status(500).json({
      error: "Enhanced AI analysis failed",
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