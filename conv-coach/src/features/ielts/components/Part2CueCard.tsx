import { examinerScript } from '../data/examinerScript';
import type { CueCard } from '../types/ielts';

interface Part2CueCardProps {
  cueCard: CueCard | null;
  isPreparation: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onStartSpeaking?: () => void;
  isRecording?: boolean;
  onMoveToPart3?: () => void;
  response?: string;
  elapsedTime: number;
}

export const Part2CueCard: React.FC<Part2CueCardProps> = ({
  cueCard,
  isPreparation,
  onStartRecording,
  onStopRecording,
  onStartSpeaking,
  isRecording = false,
  onMoveToPart3,
  response = '',
  elapsedTime
}) => {
  const remainingTime = isPreparation ? 
    Math.max(0, 60 - elapsedTime) : 
    Math.max(0, 120 - elapsedTime);

  const getTimeColor = () => {
    if (remainingTime <= 10 && !isPreparation) return 'text-red-500';
    if (remainingTime <= 30 && isPreparation) return 'text-orange-500';
    return 'text-cyan-400';
  };

  const handleMoveToPart3 = () => {
    if (isRecording && onStopRecording) {
      onStopRecording();
    }
    if (onMoveToPart3) {
      onMoveToPart3();
    }
  };

  const handleStartSpeaking = () => {
    if (onStartSpeaking) {
      onStartSpeaking();
    }
  };

  if (!cueCard) return null;

  return (
    <div className="space-y-6">
      {/* Examiner Introduction */}
      <div className="ielts-surface p-6">
        <p className="ielts-text italic">
          {examinerScript.partTransitions.toPart2}
        </p>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className="ielts-surface p-8 inline-block">
          <h3 className="ielts-subtitle mb-4">
            {isPreparation ? 'Preparation Time' : 'Speaking Time'}
          </h3>
          <div className={`text-5xl font-mono font-bold ${getTimeColor()}`}>
            {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
          </div>
          <p className="ielts-text-secondary mt-2">
            {isPreparation ? 'minutes remaining to prepare' : 'minutes remaining to speak'}
          </p>
        </div>
      </div>

      {/* Cue Card */}
      <div className="ielts-cue-card">
        <h3 className="ielts-cue-card-title">
          {cueCard.topic}
        </h3>
        <div className="space-y-4">
          {cueCard.bulletPoints.map((point, index) => (
            <div key={index} className="ielts-cue-card-bullet">
              <p className="ielts-text">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="ielts-surface p-6">
        {isPreparation ? (
          <div className="text-center">
            <div className="mb-6">
              <p className="ielts-text-secondary">
                You have 1 minute to prepare. You can make notes if you wish.
              </p>
            </div>
            {remainingTime <= 0 && (
              <button
                onClick={handleStartSpeaking}
                className="ielts-button text-lg px-8 py-3"
              >
                Start Speaking
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={`ielts-button px-6 py-3 ${
                    isRecording ? 'ielts-button-danger' : ''
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                
                {isRecording && (
                  <div className="ielts-status recording">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording
                  </div>
                )}
              </div>
              
              {response && (
                <button
                  onClick={handleMoveToPart3}
                  className="ielts-button"
                >
                  Move to Part 3
                </button>
              )}
            </div>
            
            {/* Response Display */}
            {response && (
              <div>
                <h4 className="ielts-subtitle mb-3">Your Response:</h4>
                <div className="ielts-surface p-4 max-h-64 overflow-y-auto">
                  <p className="ielts-text">{response}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="ielts-surface p-6">
        <h4 className="ielts-subtitle mb-3">Part 2 Guidelines:</h4>
        <ul className="ielts-text-secondary space-y-2">
          {isPreparation ? (
            <>
              <li>• Use the 1 minute to organize your thoughts</li>
              <li>• Make brief notes on each bullet point</li>
              <li>• Think of specific examples and details</li>
              <li>• Practice your opening sentence</li>
            </>
          ) : (
            <>
              <li>• Speak for 1-2 minutes on the topic</li>
              <li>• Cover all the bullet points in your answer</li>
              <li>• Use the bullet points as a guide, not a strict list</li>
              <li>• Speak fluently and naturally</li>
              <li>• Don't worry if the examiner stops you at 2 minutes</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};