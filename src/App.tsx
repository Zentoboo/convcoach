import { useState, useRef, useEffect } from 'react';
import {
  Mic, StopCircle, BarChart2, History, Lightbulb,
  ArrowLeft, ArrowRight, Settings, ChevronDown,
  ChevronUp, X, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
type SpeechRecognition = any;

interface Session {
  id: number;
  date: string;
  speed: number;
  fillers: number;
  fillerPercentage: number;
  confidence: number;
  transcript: string;
  feedback: string;
  duration: number;
  language: string;
}

interface LanguageConfig {
  code: string;
  name: string;
  defaultFillers: string[];
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en-US', name: 'English (US)', defaultFillers: ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'ummm', 'uhh', 'well'] },
  { code: 'es-ES', name: 'Spanish (Spain)', defaultFillers: ['este', 'eh', 'pues', 'bueno', 'sabes', 'tipo', 'vale', 'este', 'aquello'] },
  { code: 'fr-FR', name: 'French', defaultFillers: ['euh', 'ben', 'tu sais', 'en fait', 'alors', 'quoi', 'hein', 'bon'] },
  { code: 'de-DE', name: 'German', defaultFillers: ['äh', 'ähm', 'also', 'genau', 'quasi', 'halt', 'eigentlich', 'sozusagen'] },
  { code: 'it-IT', name: 'Italian', defaultFillers: ['ehm', 'allora', 'tipo', 'cioè', 'diciamo', 'insomma', 'praticamente', 'vabbè'] },
];

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [speakingSpeed, setSpeakingSpeed] = useState(0);
  const [fillerWords, setFillerWords] = useState(0);
  const [fillerPercentage, setFillerPercentage] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [customFillers, setCustomFillers] = useState<string[]>([]);
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const transcriptBufferRef = useRef('');
  const isRecordingRef = useRef(false);
  const sessionsPerPage = 3;

  // Initialize with default fillers for selected language
  useEffect(() => {
    const defaultLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
    setCustomFillers(defaultLanguage.defaultFillers);
  }, [selectedLanguage]);

  // Keep isRecordingRef synced with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Initialize speech recognition ONCE on mount
  useEffect(() => {
    console.log('Initializing speech recognition...');

    // Test microphone access
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log('Microphone access granted!');
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('Microphone access denied:', err);
          setError(`Microphone access denied: ${err.message}`);
        });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.lang = selectedLanguage; // Set initial language

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      if (interimTranscript || finalTranscript) {
        console.log('Heard:', interimTranscript || finalTranscript);
      }

      if (finalTranscript) {
        transcriptBufferRef.current += finalTranscript + ' ';
      }

      const currentDisplayTranscript = transcriptBufferRef.current + interimTranscript;
      setTranscript(currentDisplayTranscript);

      // Only calculate metrics while actively recording
      if (isRecordingRef.current && startTimeRef.current) {
        const elapsedTime = (Date.now() - startTimeRef.current) / 60000; // minutes
        const words = currentDisplayTranscript.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;

        // Prevent division by zero and cap extreme values
        const speed = elapsedTime > 0.01 ? Math.round(wordCount / elapsedTime) : 0;
        setSpeakingSpeed(speed > 0 ? speed : 0);

        // Calculate filler words percentage
        if (wordCount > 0) {
          const fillerCount = countFillerWords(currentDisplayTranscript, customFillers);
          const percentage = Math.round((fillerCount / wordCount) * 100);

          setFillerWords(fillerCount);
          setFillerPercentage(percentage);
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      let errorMsg = 'Speech recognition error: ';

      switch (event.error) {
        case 'network':
          errorMsg = '⚠️ Network error: Speech recognition requires an active internet connection.';
          break;
        case 'not-allowed':
        case 'service-not-allowed':
          errorMsg = '⚠️ Microphone permission denied. Please allow access and reload.';
          break;
        case 'no-speech':
          console.log('⚠️ No speech detected');
          return;
        case 'audio-capture':
          errorMsg = '⚠️ No microphone found. Please connect one and reload.';
          break;
        case 'aborted':
          console.log('ℹ️ Speech recognition aborted');
          return;
        case 'language-not-supported':
          errorMsg = `⚠️ The selected language (${selectedLanguage}) is not supported by your browser's speech recognition.`;
          break;
        default:
          errorMsg = `⚠️ Speech recognition error: ${event.error}`;
      }

      setError(errorMsg);
      setIsRecording(false);
      isRecordingRef.current = false;
    };

    recognitionRef.current.onend = () => {
      if (isRecordingRef.current && recognitionRef.current) {
        // Update language before restarting
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, customFillers]); // Reinitialize when language or fillers change

  const countFillerWords = (text: string, fillers: string[]): number => {
    const normalizedText = text.toLowerCase();
    let count = 0;

    fillers.forEach(filler => {
      const cleanFiller = filler.toLowerCase().trim();
      if (!cleanFiller) return;

      // Create regex that matches word boundaries but is more flexible for different languages
      const regex = new RegExp(`\\b${cleanFiller.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      count += matches ? matches.length : 0;
    });

    return count;
  };

  const startRecording = async () => {
    if (error && error.includes('not supported')) return;
    setError(null);

    try {
      // Reset metrics
      setTranscript('');
      setFillerWords(0);
      setFillerPercentage(0);
      setSpeakingSpeed(0);
      setConfidenceScore(0);
      setFeedback('');
      transcriptBufferRef.current = '';

      // Get fresh microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      // Set start time BEFORE starting recognition
      startTimeRef.current = Date.now();
      setIsRecording(true);
      isRecordingRef.current = true;

      // Update recognition language
      if (recognitionRef.current) {
        recognitionRef.current.lang = selectedLanguage;
      }

      // Start recognition
      recognitionRef.current?.start();
      console.log(`✅ Recording started with language: ${selectedLanguage}`);
    } catch (err: any) {
      console.error('❌ Microphone error:', err);
      setError(`Microphone access denied: ${err.message || 'Please allow access in settings'}`);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    isRecordingRef.current = false;
    analyzeTranscript();
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const speed = speakingSpeed;
      const fillers = fillerWords;
      const fillerPct = fillerPercentage;

      // Adjust confidence calculation to use percentage instead of absolute count
      const confidence = Math.min(100, Math.max(40, 100 - (fillerPct * 0.7) + (speed > 160 ? -8 : speed < 100 ? -12 : 0)));

      let feedbackMsg = '';

      if (speed < 100) feedbackMsg += '• Speaking pace is slow. Try increasing your speed slightly.\n';
      else if (speed > 160) feedbackMsg += '• Speaking pace is fast. Consider slowing down for better clarity.\n';

      if (fillerPct > 15) feedbackMsg += `• High filler word usage (${fillerPct}%). Practice pausing instead of using fillers.\n`;
      else if (fillerPct > 8) feedbackMsg += `• Moderate filler word usage (${fillerPct}%). Work on reducing these.\n`;

      if (confidence < 70) feedbackMsg += `• Confidence score is low (${Math.round(confidence)}%). Maintain eye contact and use stronger posture.\n`;

      if (!feedbackMsg) {
        feedbackMsg = 'Excellent delivery! Well-paced with minimal fillers and strong confidence.';
      }

      setConfidenceScore(Math.round(confidence));
      setFeedback(feedbackMsg);

      const newSession: Session = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        speed,
        fillers,
        fillerPercentage: fillerPct,
        confidence: Math.round(confidence),
        transcript: transcript,
        feedback: feedbackMsg,
        duration: Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000),
        language: selectedLanguage
      };

      setHistory(prev => [newSession, ...prev]);
    } catch (err) {
      setError('Failed to analyze transcript. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const paginatedHistory = history.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );

  const totalPages = Math.ceil(history.length / sessionsPerPage);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(false)}
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Coach
            </motion.button>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <History className="mr-3 text-emerald-400" size={32} />
              Session History
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30 hover:border-emerald-800/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{session.date}</h3>
                      <p className="text-emerald-400/80 text-sm">Language: {SUPPORTED_LANGUAGES.find(l => l.code === session.language)?.name || session.language}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-md text-sm font-medium ${session.confidence >= 85 ? 'bg-emerald-500/20 text-emerald-300' :
                      session.confidence >= 70 ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                      Confidence: {session.confidence}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
                      <div className="flex items-center text-emerald-400 mb-2">
                        <BarChart2 size={20} className="mr-2" />
                        <span className="text-sm font-medium">Speaking Speed</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{session.speed} WPM</p>
                      <p className="text-gray-400 text-sm">
                        {session.speed < 100 ? 'Slow' : session.speed > 160 ? 'Fast' : 'Optimal'}
                      </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
                      <div className="flex items-center text-emerald-400 mb-2">
                        <Lightbulb size={20} className="mr-2" />
                        <span className="text-sm font-medium">Filler Words</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{session.fillerPercentage}%</p>
                      <p className="text-gray-400 text-sm">
                        {session.fillerPercentage > 15 ? 'High' : session.fillerPercentage > 8 ? 'Moderate' : 'Low'}
                      </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
                      <div className="flex items-center text-emerald-400 mb-2">
                        <div className="mr-2 w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</p>
                      <p className="text-gray-400 text-sm">Minutes:Seconds</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <h4 className="text-white font-medium mb-2 text-sm">Transcript</h4>
                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm">{session.transcript}</p>
                    <h4 className="text-white font-medium mb-2 text-sm">Feedback</h4>
                    <p className="text-gray-300 whitespace-pre-line text-sm">{session.feedback}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-black/30 backdrop-blur-xl rounded-xl border border-dashed border-emerald-800/40">
                <History className="mx-auto text-emerald-500 mb-4" size={48} />
                <h3 className="text-xl font-medium text-white mb-2">No Session History</h3>
                <p className="text-gray-400">Your coaching sessions will appear here after completing recordings</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
                  }`}
              >
                <ArrowLeft size={20} />
              </motion.button>

              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-md font-medium text-sm ${currentPage === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {i + 1}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
                  }`}
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center mb-4 sm:mb-0"
          >
            <div className="bg-emerald-600/90 p-3 rounded-xl mr-4 border border-emerald-500/30">
              <Mic size={32} className="text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Conversation Coach</h1>
              <p className="text-emerald-400/90 text-sm">Real-time speaking analytics & feedback</p>
            </div>
          </motion.div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="flex items-center px-4 py-2.5 bg-black/40 backdrop-blur-md text-emerald-300 rounded-lg border border-emerald-800/40 hover:border-emerald-700/60 transition-all duration-300"
            >
              <Settings size={20} className="mr-2" />
              Settings
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(true)}
              className="flex items-center px-4 py-2.5 bg-black/40 backdrop-blur-md text-emerald-300 rounded-lg border border-emerald-800/40 hover:border-emerald-700/60 transition-all duration-300"
            >
              <History size={20} className="mr-2" />
              View History
            </motion.button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 backdrop-blur-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Live Coaching Session</h2>
                <p className="text-gray-400 text-sm">Speak naturally as if in a real conversation</p>
              </div>
              <div className="text-xs bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded-md">
                {currentLanguage.name}
              </div>
              {isAnalyzing && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-emerald-500/15 text-emerald-300 rounded-md text-sm font-medium flex items-center"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  Analyzing...
                </motion.div>
              )}
            </div>

            <div className="bg-black/50 rounded-lg p-5 mb-6 min-h-[200px] max-h-[300px] overflow-y-auto border border-emerald-900/20">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-mono">
                {transcript || 'Your transcript will appear here during recording...'}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isRecording ? [1, 1.05, 1] : 1,
                  borderColor: isRecording ? ['#10b981', '#34d399', '#10b981'] : '#2d3748'
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 flex items-center justify-center mb-6 ${isRecording ? 'border-emerald-500' : 'border-gray-700'
                  }`}
              >
                {isRecording ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-12 h-12 md:w-16 md:h-16 bg-rose-600 rounded-xl flex items-center justify-center"
                  >
                    <StopCircle size={28} className="text-white drop-shadow-md" />
                  </motion.div>
                ) : (
                  <Mic size={40} className="text-emerald-400 drop-shadow-md" />
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                className={`px-8 py-3.5 rounded-lg font-semibold text-base flex items-center shadow-lg ${isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : isAnalyzing
                    ? 'bg-gray-700 cursor-not-allowed text-gray-300'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
              >
                {isRecording ? (
                  <>
                    <StopCircle size={20} className="mr-2" />
                    Stop & Analyze
                  </>
                ) : isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic size={20} className="mr-2" />
                    Start Coaching Session
                  </>
                )}
              </motion.button>

              {isRecording && (
                <p className="mt-3 text-emerald-400/90 font-medium text-sm">
                  Speaking... (Click again to stop and get feedback)
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
          >
            <h2 className="text-xl font-bold text-white mb-5 flex items-center">
              <BarChart2 className="mr-2.5 text-emerald-400" size={22} />
              Performance Metrics
            </h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 text-sm font-medium">Speaking Speed</span>
                  <span className="text-white font-bold">{speakingSpeed} WPM</span>
                </div>
                <div className="w-full bg-gray-900 rounded-lg h-2.5 overflow-hidden border border-gray-800">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: speakingSpeed === 0 ? "0%" :
                        speakingSpeed < 100 ? "40%" :
                          speakingSpeed > 160 ? "90%" : "65%",
                      backgroundColor: speakingSpeed === 0 ? "#6b7280" :
                        speakingSpeed < 100 ? "#f59e0b" :
                          speakingSpeed > 160 ? "#ef4444" : "#10b981"
                    }}
                    className="h-full rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {speakingSpeed === 0 ? 'Not speaking' :
                    speakingSpeed < 100 ? 'Slow pace' :
                      speakingSpeed > 160 ? 'Fast pace' : 'Optimal pace (100-160 WPM)'}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 text-sm font-medium">Filler Words</span>
                  <span className="text-white font-bold">{fillerPercentage}%</span>
                </div>
                <div className="w-full bg-gray-900 rounded-lg h-2.5 overflow-hidden border border-gray-800">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${Math.min(100, fillerPercentage)}%`,
                      backgroundColor: fillerPercentage === 0 ? "#10b981" :
                        fillerPercentage > 15 ? "#ef4444" :
                          fillerPercentage > 8 ? "#f59e0b" : "#10b981"
                    }}
                    className="h-full rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {fillerPercentage === 0 ? 'No fillers detected' :
                    fillerPercentage > 15 ? 'High usage' :
                      fillerPercentage > 8 ? 'Moderate usage' : 'Minimal usage'}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 text-sm font-medium">Confidence Score</span>
                  <span className="text-white font-bold">{confidenceScore}%</span>
                </div>
                <div className="w-full bg-gray-900 rounded-lg h-2.5 overflow-hidden border border-gray-800">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${confidenceScore}%`,
                      backgroundColor: confidenceScore === 0 ? "#6b7280" :
                        confidenceScore > 85 ? "#10b981" :
                          confidenceScore > 70 ? "#f59e0b" : "#ef4444"
                    }}
                    className="h-full rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {confidenceScore === 0 ? 'Not calculated' :
                    confidenceScore > 85 ? 'Excellent' :
                      confidenceScore > 70 ? 'Good' : 'Needs improvement'}
                </p>
              </div>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-7 p-4 bg-emerald-900/15 border-l-2 border-emerald-500 rounded-r-md"
              >
                <h3 className="text-base font-semibold text-emerald-300 mb-2 flex items-center">
                  <Lightbulb className="mr-2" size={18} />
                  Coaching Feedback
                </h3>
                <p className="text-gray-200 whitespace-pre-line text-sm leading-relaxed">{feedback}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md border border-emerald-500/20 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header - Fixed */}
              <div className="flex justify-between items-center p-6 border-b border-emerald-900/30">
                <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
                  <Settings className="mr-3 text-emerald-400" size={24} />
                  Settings
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <X size={28} />
                </motion.button>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

                {/* Language Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500/70 flex items-center">
                    <Globe className="mr-2" size={16} />
                    Voice Language
                  </h3>

                  <div className="relative group">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full appearance-none bg-black/60 border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer hover:bg-black/80"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-gray-900">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    {/* Moving Chevron closer to center: 
               Changed 'right-4' to 'right-8' or 'right-[15%]' 
            */}
                    <div className="absolute inset-y-0 right-6 flex items-center px-2 pointer-events-none group-hover:text-emerald-300 transition-colors">
                      <ChevronDown size={18} className="text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-500 italic">
                    Note: Speech recognition accuracy depends on your browser's local engine and microphone quality.
                  </p>
                </div>

                {/* Filler Words Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500/70 flex items-center">
                      <Lightbulb className="mr-2" size={16} />
                      Filler Word Tracking
                    </h3>
                    <button
                      onClick={() => setCustomFillers(SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.defaultFillers || [])}
                      className="text-[11px] font-medium text-emerald-500/60 hover:text-emerald-400 underline decoration-emerald-500/20 underline-offset-4"
                    >
                      Reset to Defaults
                    </button>
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 border border-emerald-900/30">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {customFillers.map((filler, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center bg-emerald-500/10 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-500/20"
                        >
                          {filler}
                          <button
                            onClick={() => setCustomFillers(prev => prev.filter((_, i) => i !== index))}
                            className="ml-1.5 hover:text-white transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </motion.span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type word..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            setCustomFillers(prev => [...prev, e.currentTarget.value.trim()]);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1 bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {
                            setCustomFillers(prev => [...prev, input.value.trim()]);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-600/30 border border-emerald-500/20 transition-all"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Current analysis set for: <span className="text-emerald-500/80 font-medium">{currentLanguage.name}</span>
                  </p>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-4 bg-black/20 border-t border-emerald-900/30 text-center">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;