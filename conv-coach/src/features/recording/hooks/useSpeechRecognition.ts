import { useState, useRef, useEffect } from 'react';
import type { SpeechRecognitionState } from '../../../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;

interface UseSpeechRecognitionProps {
  selectedLanguage: string;
  customFillers: string[];
}

export const useSpeechRecognition = ({ selectedLanguage, customFillers }: UseSpeechRecognitionProps) => {
  const [state, setState] = useState<SpeechRecognitionState>({
    isRecording: false,
    isAnalyzing: false,
    speakingSpeed: 0,
    fillerWords: 0,
    fillerPercentage: 0,
    confidenceScore: 0,
    transcript: '',
    feedback: '',
    timelineData: []
  });

  const [error, setError] = useState<string | null>(null);
  const [triggerAIAnalysis, setTriggerAIAnalysis] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const lastWordRef = useRef('');
  const lastWordTimeRef = useRef(0);
  const lastUpdateTimestampRef = useRef(0);
  const processedWordsRef = useRef<string[]>([]);
  const wordCountRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const transcriptBufferRef = useRef('');
  const isRecordingRef = useRef(false);

  const MAX_WPM = 300;

  useEffect(() => {
    isRecordingRef.current = state.isRecording;
  }, [state.isRecording]);

  const countFillerWords = (text: string, fillers: string[]): number => {
    const normalizedText = text.toLowerCase();
    let count = 0;

    fillers.forEach(filler => {
      const cleanFiller = filler.toLowerCase().trim();
      if (!cleanFiller) return;

      const regex = new RegExp(`\\b${cleanFiller.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      count += matches ? matches.length : 0;
    });

    return count;
  };

  const initializeSpeechRecognition = () => {
    console.log('Initializing speech recognition...');
    
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
    recognitionRef.current.lang = selectedLanguage;

    recognitionRef.current.onresult = (event: any) => {
      if (!startTimeRef.current || !isRecordingRef.current) return;

      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        interimTranscript += event.results[i][0].transcript;
      }

      const interimWords = interimTranscript.trim().split(/\s+/).filter(Boolean);

      if (interimWords.length > 0) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - startTimeRef.current) / 1000;

        const lastWord = interimWords[interimWords.length - 1];
        const cleanWord = lastWord.toLowerCase().replace(/[.,?!]/g, '');

        const isNewWord = !processedWordsRef.current.includes(`${cleanWord}-${interimWords.length}`);

        if (isNewWord) {
          transcriptBufferRef.current += lastWord + ' ';
          processedWordsRef.current.push(`${cleanWord}-${interimWords.length}`);

          const isFiller = customFillers.some(f => cleanWord === f.toLowerCase().trim());
          const totalWords = transcriptBufferRef.current.trim().split(/\s+/).length;
          const timeInMinutes = elapsedSeconds / 60;
          const currentSpeed = timeInMinutes > 0.01 ? Math.min(MAX_WPM, Math.round(totalWords / timeInMinutes)) : 0;

          setState(prev => ({
            ...prev,
            timelineData: [...prev.timelineData, {
              time: elapsedSeconds,
              wpm: currentSpeed,
              word: lastWord,
              isFiller: isFiller
            }],
            speakingSpeed: currentSpeed,
            fillerWords: countFillerWords(transcriptBufferRef.current, customFillers),
            fillerPercentage: Math.round((countFillerWords(transcriptBufferRef.current, customFillers) / totalWords) * 100),
            transcript: transcriptBufferRef.current
          }));
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMsg = 'Speech recognition error: ';
      switch (event.error) {
        case 'network':
          errorMsg = 'Network error: Speech recognition requires an active internet connection.';
          break;
        case 'not-allowed':
        case 'service-not-allowed':
          errorMsg = 'Microphone permission denied. Please allow access and reload.';
          break;
        case 'no-speech':
          console.log('No speech detected');
          return;
        case 'audio-capture':
          errorMsg = 'No microphone found. Please connect one and reload.';
          break;
        case 'aborted':
          console.log('Speech recognition aborted');
          return;
        case 'language-not-supported':
          errorMsg = `The selected language (${selectedLanguage}) is not supported by your browser's speech recognition.`;
          break;
        default:
          errorMsg = `Speech recognition error: ${event.error}`;
      }
      setError(errorMsg);
      setState(prev => ({ ...prev, isRecording: false }));
      isRecordingRef.current = false;
    };

    recognitionRef.current.onend = () => {
      if (isRecordingRef.current && recognitionRef.current) {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
      }
    };
  };

  const startRecording = async () => {
    setSessionId(null);
    if (error && error.includes('not supported')) return;
    setError(null);

    try {
      setState(prev => ({
        ...prev,
        transcript: '',
        fillerWords: 0,
        fillerPercentage: 0,
        speakingSpeed: 0,
        confidenceScore: 0,
        feedback: '',
        timelineData: []
      }));

      transcriptBufferRef.current = '';
      processedWordsRef.current = [];
      lastWordRef.current = '';
      lastWordTimeRef.current = 0;
      lastUpdateTimestampRef.current = 0;
      wordCountRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      startTimeRef.current = Date.now();
      setState(prev => ({ ...prev, isRecording: true }));
      isRecordingRef.current = true;

      if (!recognitionRef.current) {
        initializeSpeechRecognition();
      }

      if (recognitionRef.current) {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
      }

      console.log(`Recording started with language: ${selectedLanguage}`);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError(`Microphone access denied: ${err.message || 'Please allow access in settings'}`);
      setState(prev => ({ ...prev, isRecording: false }));
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setState(prev => ({ ...prev, isRecording: false }));
    isRecordingRef.current = false;

    setTimeout(() => {
      console.log('Recording stopped. Timeline data points:', state.timelineData.length);
      console.log('Final transcript word count:', state.transcript.trim().split(/\s+/).filter(Boolean).length);
      console.log('Timeline words covered:', state.timelineData.length);
      analyzeTranscript();
    }, 500);
  };

  const analyzeTranscript = async () => {
    if (!state.transcript.trim()) return;
    setState(prev => ({ ...prev, isAnalyzing: true }));
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const speed = state.speakingSpeed;
      const fillerPct = state.fillerPercentage;
      let speedAdjustment = 0;
      if (speed < 120) speedAdjustment = -15;
      else if (speed < 150) speedAdjustment = -5;
      else if (speed > 220) speedAdjustment = -15;
      else if (speed > 190) speedAdjustment = -5;
      else speedAdjustment = 5;

      const confidence = Math.min(100, Math.max(40, 100 - (fillerPct * 0.7) + speedAdjustment));

      let feedbackMsg = '';
      if (speed < 120) feedbackMsg += '• Speaking pace is too slow (< 120 WPM). Speech may sound dragging and reduce listener engagement. Try increasing your pace.\n';
      else if (speed < 150) feedbackMsg += '• Speaking pace is slightly slow (120-150 WPM). Your delivery would benefit from increased energy and slightly faster pacing.\n';
      else if (speed > 220) feedbackMsg += '• Speaking pace is too fast (> 220 WPM). This makes speech difficult to follow and negatively affects comprehension. Significantly slow down your pace.\n';
      else if (speed > 190) feedbackMsg += '• Speaking pace is slightly fast (190-220 WPM). Consider slowing down for better clarity and to allow listeners time to process.\n';

      if (fillerPct > 15) feedbackMsg += `• High filler word usage (${fillerPct}%). Practice pausing instead of using fillers.\n`;
      else if (fillerPct > 8) feedbackMsg += `• Moderate filler word usage (${fillerPct}%). Work on reducing these.\n`;

      if (confidence < 70) feedbackMsg += `• Confidence score is low (${Math.round(confidence)}%). Maintain eye contact and use stronger posture.\n`;

      if (!feedbackMsg) {
        feedbackMsg = 'Excellent delivery! Well-paced with minimal fillers and strong confidence.';
      }

      const currentTimeline = state.timelineData.map(point => ({
        time: Number(point.time) || 0,
        wpm: Number(point.wpm) || 0,
        word: String(point.word || ''),
        isFiller: Boolean(point.isFiller)
      }));

      const newSessionData = {
        date: new Date().toLocaleString(),
        speed: state.speakingSpeed,
        fillers: state.fillerWords,
        fillerPercentage: state.fillerPercentage,
        confidence: Math.round(confidence),
        topic: sessionTopic,
        transcript: state.transcript,
        feedback: feedbackMsg,
        duration: Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000),
        language: selectedLanguage,
        timeline: currentTimeline
      };

      console.log('Session data being saved:', newSessionData);

      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSessionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedSession = await response.json();
      setSessionId(savedSession._id);
      setSessionTopic('');

      console.log('Session saved successfully:', savedSession);

      setState(prev => ({
        ...prev,
        confidenceScore: Math.round(confidence),
        feedback: feedbackMsg,
        isAnalyzing: false
      }));

      return savedSession;
    } catch (err: any) {
      console.error('Error saving session:', err);
      setError('Connection to database failed. Make sure your server is running.');
      setState(prev => ({ ...prev, isAnalyzing: false }));
      return null;
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [selectedLanguage, customFillers]);

  return {
    state,
    error,
    sessionTopic,
    setSessionTopic,
    sessionId,
    startRecording,
    stopRecording,
    analyzeTranscript,
    triggerAIAnalysis,
    setTriggerAIAnalysis
  };
};