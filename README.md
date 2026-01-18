# conv-coach

provides real-time speaking analytics, including WPM tracking, filler word detection, and session history.
### 1. Prerequisites
* **Node.js** (v14+)
* **MongoDB** (Running locally on `mongodb://localhost:27017`)
* **Browser**: Google Chrome or Microsoft Edge (required for Web Speech API)

### 2. Backend Installation
```bash
# Navigate to server folder
cd server
# Install dependencies
npm install express mongoose cors
# Start the server
node index.js
```
Server runs on: `http://localhost:5000`

### 3.  Frontend Installation
```
# Navigate to project root
cd client
# Install dependencies
npm install lucide-react framer-motion recharts
# Start the app
npm run dev
```

| Category          | Speaking Rate (WPM) | Description |
|-------------------|--------------------|------------|
| Too Slow          | < 120              | Speech may sound dragging or unnatural and can reduce listener engagement. |
| Slightly Slow     | 120–150            | Generally understandable, but delivery may benefit from increased energy and pacing. |
| Optimal           | 150–190            | Preferred range for listener comprehension and comfort; peak preference occurs near 175 WPM. |
| Slightly Fast     | 190–220            | Acceptable in some contexts, though clarity and listener processing may begin to decline. |
| Too Fast          | > 220              | Speech may be difficult to follow and can negatively affect comprehension. |

Adapted from Lass and Prater (1973)
# references
Lass, N. J., & Prater, C. E. (1973). A comparative study of listening rate preferences for oral reading and impromptu speaking tasks. Journal of Communication, 23(1), 95–102. https://doi.org/10.1111/j.1460-2466.1973.tb00934.x