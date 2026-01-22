import { examinerScript } from '../data/examinerScript';
import type { Question } from '../types/ielts';

interface Part1QuestionsProps {
  questions: Question[];
  currentQuestionIndex: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  onNext: () => void;
  onMoveToPart2: () => void;
  responses: string[];
}

export const Part1Questions: React.FC<Part1QuestionsProps> = ({
  questions,
  currentQuestionIndex,
  onStartRecording,
  onStopRecording,
  isRecording,
  onNext,
  onMoveToPart2,
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
      onMoveToPart2();
    } else {
      onNext();
    }
  };

  const getExaminerIntro = () => {
    if (isFirstQuestion) {
      return (
        <div className="ielts-surface p-6 mb-6">
          <p className="ielts-text italic">
            {examinerScript.introduction[examinerScript.introduction.length - 1]}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTransitionalPhrase = () => {
    if (!isFirstQuestion) {
      return (
        <p className="ielts-text-secondary italic mb-4">
          Now I'd like to ask you about {currentQuestion.category.toLowerCase()}...
        </p>
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
            Part 1 - Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="ielts-text-secondary">
            Topic: {currentQuestion.category}
          </span>
        </div>
        
        {getTransitionalPhrase()}
        
        <div className="ielts-question">
          <p className="ielts-question-text">
            {currentQuestion.question}
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <p className="ielts-text-secondary text-sm">
            You should speak for approximately 10-20 seconds. Give a direct answer and explain why.
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
              {isLastQuestion ? 'Move to Part 2' : 'Next Question'}
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
        <h4 className="ielts-subtitle mb-3">Part 1 Guidelines:</h4>
        <ul className="ielts-text-secondary space-y-2">
          <li>• Give direct answers to the questions</li>
          <li>• Explain your reasoning and provide examples</li>
          <li>• Keep answers concise (10-20 seconds)</li>
          <li>• Speak naturally and conversationally</li>
        </ul>
      </div>
    </div>
  );
};