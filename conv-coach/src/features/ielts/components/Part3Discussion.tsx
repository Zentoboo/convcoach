import { examinerScript } from '../data/examinerScript';
import type { Question } from '../types/ielts';

interface Part3DiscussionProps {
  questions: Question[];
  currentQuestionIndex: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  onNext: () => void;
  onComplete: () => void;
  responses: string[];
}

export const Part3Discussion: React.FC<Part3DiscussionProps> = ({
  questions,
  currentQuestionIndex,
  onStartRecording,
  onStopRecording,
  isRecording,
  onNext,
  onComplete,
  responses
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses[currentQuestionIndex] || '';
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleContinue = () => {
    if (isRecording) {
      onStopRecording();
    }
    
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  const getExaminerIntro = () => {
    if (isFirstQuestion) {
      return (
        <div className="ielts-surface p-6 mb-6">
          <p className="ielts-text italic">
            {examinerScript.partTransitions.toPart3}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Examiner Introduction */}
      {getExaminerIntro()}
      
      {/* Question Card */}
      <div className="ielts-surface-elevated p-8">
        <div className="flex justify-between items-start mb-4">
          <span className="ielts-part-indicator active">
            Part 3 - Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="ielts-text-secondary">
            Topic: {currentQuestion.category}
          </span>
        </div>
        
        <div className="ielts-question">
          <p className="ielts-question-text">
            {currentQuestion.question}
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <p className="ielts-text-secondary text-sm">
            Give extended answers (up to 1 minute). Explain, speculate, justify, and evaluate your ideas.
          </p>
        </div>
      </div>

      {/* Response Controls */}
      <div className="ielts-surface p-6">
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
          
          {currentResponse && (
            <button
              onClick={handleContinue}
              className="ielts-button"
            >
              {isLastQuestion ? 'Complete Test' : 'Next Question'}
            </button>
          )}
        </div>
        
        {/* Response Display */}
        {currentResponse && (
          <div className="mt-6">
            <h4 className="ielts-subtitle mb-3">Your Response:</h4>
            <div className="ielts-surface p-4 max-h-32 overflow-y-auto">
              <p className="ielts-text">{currentResponse}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="ielts-surface p-6">
        <h4 className="ielts-subtitle mb-3">Part 3 Guidelines:</h4>
        <ul className="ielts-text-secondary space-y-2">
          <li>• Give longer, more detailed answers</li>
          <li>• Develop your ideas with examples and explanations</li>
          <li>• Express opinions and justify them</li>
          <li>• Speculate about future possibilities</li>
          <li>• Compare and contrast different viewpoints</li>
          <li>• Speak for up to 1 minute per question</li>
        </ul>
      </div>
    </div>
  );
};