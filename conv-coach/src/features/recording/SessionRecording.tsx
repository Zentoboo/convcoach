
import { SUPPORTED_LANGUAGES } from '../../constants';
import SessionTopicInput from './SessionTopicInput';
import TranscriptDisplay from './TranscriptDisplay';
import RecordingControls from './RecordingControls';

interface SessionRecordingProps {
  isRecording: boolean;
  isAnalyzing: boolean;
  sessionTopic: string;
  setSessionTopic: (topic: string) => void;
  transcript: string;
  selectedLanguage: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const SessionRecording = ({
  isRecording,
  isAnalyzing,
  sessionTopic,
  setSessionTopic,
  transcript,
  selectedLanguage,
  onStartRecording,
  onStopRecording
}: SessionRecordingProps) => {
  const currentLanguage = SUPPORTED_LANGUAGES.find((lang: any) => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div
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
          <div
            className="px-3 py-1 bg-emerald-500/15 text-emerald-300 rounded-md text-sm font-medium flex items-center"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            Analyzing...
          </div>
        )}
      </div>

      <SessionTopicInput
        sessionTopic={sessionTopic}
        setSessionTopic={setSessionTopic}
        isRecording={isRecording}
        isAnalyzing={isAnalyzing}
      />

      <TranscriptDisplay transcript={transcript} />

      <RecordingControls
        isRecording={isRecording}
        isAnalyzing={isAnalyzing}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
      />
    </div>
  );
};

export default SessionRecording;