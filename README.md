# Conversation Coach
(prototype to coach person's communication skill)
A real-time speech analysis application that provides instant feedback on speaking patterns, delivery metrics, and communication effectiveness using AI-powered insights.

Demo video (with sound): https://youtu.be/0-93NrIPfo8

## Features

### Core Functionality
- **Real-time Speech Recognition**: Live transcription with browser-based speech recognition
- **Performance Metrics**: Tracks speaking speed (WPM), filler word usage, and confidence scores
- **Speech Timeline Visualization**: Interactive charts showing speaking patterns over time
- **AI-Powered Feedback**: Contextual communication insights using Google Gemini API
- **Session History**: Persistent storage and review of past coaching sessions

### Customization
- **Multi-language Support**: English, Spanish, French, German, and Italian
- **Customizable Filler Words**: Define and track language-specific filler words
- **Topic-Based Analysis**: Optional session topics for targeted AI feedback

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Google Gemini API key
- Modern web browser with Web Speech API support (Chrome or Edge recommended)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd conversation-coach
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start MongoDB:
```bash
mongod --dbpath /path/to/data/directory
```

Start the backend server:
```bash
node index.js
```
Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Application runs on `http://localhost:5173`

## Configuration

### MongoDB Connection
The application connects to MongoDB at `mongodb://localhost:27017/convocoach`. Modify the connection string in `backend/index.js` if using a different configuration.

### Gemini API
Obtain an API key from [Google AI Studio](https://aistudio.google.com/). The API is used for generating personalized communication feedback based on session data.

## Usage

1. **Start a Session**: Click "Start Coaching Session" to begin recording
2. **Set a Topic** (Optional): Define a discussion topic for AI-powered content analysis
3. **Speak Naturally**: The application transcribes and analyzes speech in real-time
4. **Stop and Analyze**: Click "Stop & Analyze" to generate performance metrics
5. **Review AI Insights**: View personalized feedback on delivery and content quality
6. **Access History**: Navigate to session history to review past performances

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Framer Motion for animations
- Recharts for data visualization
- React Markdown for AI feedback rendering
- Tailwind CSS for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Google Generative AI SDK (Gemini)
- CORS enabled for local development

### APIs
- Web Speech API for speech recognition
- Google Gemini 2.5 Flash for AI analysis

## Browser Compatibility

The application requires browser support for:
- Web Speech API (SpeechRecognition)
- MediaDevices API (getUserMedia)
- Modern ES6+ JavaScript features

Recommended browsers: Chrome 80+, Edge 80+

## Data Storage

### Session Data
- Transcript and metrics stored in MongoDB
- Timeline data with word-level analysis
- AI-generated feedback persisted to database
- Language and custom filler word preferences

### Settings
- Language preference
- Custom filler word lists
- Stored per-user in MongoDB (default_user)

## Development Notes

- Frontend proxy configuration routes `/api` requests to backend
- CORS is enabled for `http://localhost:5173`
- Speech recognition requires HTTPS in production environments
- MongoDB collections: `sessions` and `settings`

## future enhancements

- Presentation Practice – Upload slides, teleprompter mode, slide timing, and screen sharing.
- Smart Speech Analysis – Pace, tone, pauses, vocabulary, repetition, and delivery insights.
- AI Coaching – Context-aware feedback, Q&A simulation, sentiment, and pronunciation support.
- Practice & Review – Goals, rehearsal timers, audio/video recording, and take comparison.
- Progress Tracking – Dashboards, trends, milestones, and exportable reports.
- Collaboration & Gamification – Sharing, peer feedback, teams, streaks, and achievements.

## references

| Category          | Speaking Rate (WPM) | Description |
|-------------------|--------------------|------------|
| Too Slow          | < 120              | Speech may sound dragging or unnatural and can reduce listener engagement. |
| Slightly Slow     | 120–150            | Generally understandable, but delivery may benefit from increased energy and pacing. |
| Optimal           | 150–190            | Preferred range for listener comprehension and comfort; peak preference occurs near 175 WPM. |
| Slightly Fast     | 190–220            | Acceptable in some contexts, though clarity and listener processing may begin to decline. |
| Too Fast          | > 220              | Speech may be difficult to follow and can negatively affect comprehension. |

Adapted from Lass and Prater (1973)

Lass, N. J., & Prater, C. E. (1973). A comparative study of listening rate preferences for oral reading and impromptu speaking tasks. Journal of Communication, 23(1), 95–102. https://doi.org/10.1111/j.1460-2466.1973.tb00934.x

## License
This project is provided as-is for educational and personal use.