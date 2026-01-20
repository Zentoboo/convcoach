import { motion } from 'framer-motion';
import { Mic, StopCircle } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isAnalyzing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isAnalyzing,
  onStartRecording,
  onStopRecording
}: RecordingControlsProps) => {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isAnalyzing}
        className={`px-8 py-3.5 rounded-lg font-semibold text-base flex items-center shadow-lg ${
          isRecording
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
  );
};

export default RecordingControls;