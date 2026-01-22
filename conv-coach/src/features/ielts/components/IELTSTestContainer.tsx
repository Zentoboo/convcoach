import { useState, useEffect } from 'react';
import { TestTimer } from './TestTimer';
import { Part1Questions } from './Part1Questions';
import { Part2CueCard } from './Part2CueCard';
import { Part3Discussion } from './Part3Discussion';
import type { IELTSTestState, TestMode, Question, CueCard } from '../types/ielts';
import { getRandomPart1Questions } from '../data/part1Questions';
import { getRandomCueCard } from '../data/cueCards';
import { getPart3Questions } from '../data/part3Questions';

interface IELTSTestContainerProps {
  testMode: TestMode;
  onBackToHome: () => void;
}

export const IELTSTestContainer: React.FC<IELTSTestContainerProps> = ({
  testMode,
  onBackToHome
}) => {
  const [testState, setTestState] = useState<IELTSTestState>({
    currentPart: 'introduction',
    isRecording: false,
    isAnalyzing: false,
    startTime: null,
    elapsedTime: 0,
    partTimes: {
      part1: 0,
      part2Prep: 0,
      part2Speaking: 0,
      part3: 0
    }
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cueCard, setCueCard] = useState<CueCard | null>(null);
  const [responses] = useState({
    part1: [] as string[],
    part2: '',
    part3: [] as string[]
  });

  useEffect(() => {
    if (testMode === 'ielts') {
      // Initialize test with random questions
      const part1Questions = getRandomPart1Questions(2);
      const selectedCueCard = getRandomCueCard();
      const part3QuestionsList = getPart3Questions(selectedCueCard.id);
      
      // Use setTimeout to avoid setting state during render
      setTimeout(() => {
        setQuestions([...part1Questions, ...part3QuestionsList]);
        setCueCard(selectedCueCard);
      }, 0);
    }
  }, [testMode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (testState.startTime && testState.currentPart !== 'completed') {
      interval = setInterval(() => {
        setTestState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000)
        }));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [testState.startTime, testState.currentPart]);

  const startTest = () => {
    setTestState(prev => ({
      ...prev,
      currentPart: 'part1',
      startTime: new Date()
    }));
  };

  const moveToPart2 = () => {
    setTestState(prev => ({
      ...prev,
      currentPart: 'part2-prep'
    }));
  };

  const startPart2Speaking = () => {
    setTestState(prev => ({
      ...prev,
      currentPart: 'part2-speaking',
      partTimes: {
        ...prev.partTimes,
        part2Prep: 60 // Assume 1 minute preparation
      }
    }));
  };

  const moveToPart3 = () => {
    setCurrentQuestionIndex(0); // Reset for Part 3 questions
    setTestState(prev => ({
      ...prev,
      currentPart: 'part3'
    }));
  };

  const completeTest = () => {
    setTestState(prev => ({
      ...prev,
      currentPart: 'completed'
    }));
  };

  const handleStartRecording = () => {
    setTestState(prev => ({
      ...prev,
      isRecording: true
    }));
  };

  const handleStopRecording = () => {
    setTestState(prev => ({
      ...prev,
      isRecording: false
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const renderCurrentPart = () => {
    switch (testState.currentPart) {
      case 'introduction':
        return (
          <div className="ielts-surface-elevated p-8 text-center">
            <h2 className="ielts-title mb-6">IELTS Speaking Test</h2>
            <div className="ielts-text mb-8 max-w-2xl mx-auto">
              <p className="mb-4">
                Welcome to the IELTS Speaking Test simulation. This test consists of three parts:
              </p>
              <div className="text-left space-y-3 ielts-text-secondary">
                <p><strong>Part 1:</strong> 4-5 minutes - Introduction and interview</p>
                <p><strong>Part 2:</strong> 3-4 minutes - Individual long turn</p>
                <p><strong>Part 3:</strong> 4-5 minutes - Two-way discussion</p>
              </div>
              <p className="mt-6">
                The test will take approximately 11-14 minutes to complete.
              </p>
            </div>
            <button 
              onClick={startTest}
              className="ielts-button text-lg px-8 py-3"
            >
              Start Test
            </button>
          </div>
        );

      case 'part1': {
        return (
          <Part1Questions
            questions={questions.slice(0, 2)}
            currentQuestionIndex={currentQuestionIndex}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            isRecording={testState.isRecording}
            onNext={handleNextQuestion}
            onMoveToPart2={moveToPart2}
            responses={responses.part1}
          />
        );
      }

      case 'part2-prep':
        return (
          <Part2CueCard
            cueCard={cueCard}
            isPreparation={true}
            onStartSpeaking={startPart2Speaking}
            elapsedTime={testState.partTimes.part2Prep}
          />
        );

      case 'part2-speaking':
        return (
          <Part2CueCard
            cueCard={cueCard}
            isPreparation={false}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            isRecording={testState.isRecording}
            onMoveToPart3={moveToPart3}
            response={responses.part2}
            elapsedTime={testState.partTimes.part2Speaking}
          />
        );

      case 'part3':
        const part3Questions = questions.slice(2);
        return (
          <Part3Discussion
            questions={part3Questions}
            currentQuestionIndex={currentQuestionIndex}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            isRecording={testState.isRecording}
            onNext={handleNextQuestion}
            onComplete={completeTest}
            responses={responses.part3}
          />
        );

      case 'completed':
        return (
          <div className="ielts-surface-elevated p-8 text-center">
            <h2 className="ielts-title mb-6">Test Completed</h2>
            <div className="ielts-text mb-8">
              <p>Thank you for completing the IELTS Speaking Test simulation.</p>
              <p className="mt-4">Your responses have been recorded and will be analyzed.</p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={onBackToHome}
                className="ielts-button"
              >
                Back to Home
              </button>
              <button 
                className="ielts-button-secondary"
                disabled
              >
                View Results (Coming Soon)
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ielts-mode min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToHome}
              className="ielts-button-secondary"
            >
              ← Back to Home
            </button>
            <h1 className="ielts-title">IELTS Speaking Test</h1>
          </div>
          
          <TestTimer
            currentPart={testState.currentPart}
            elapsedTime={testState.elapsedTime}
            partTimes={testState.partTimes}
          />
        </div>

        {/* Main Content */}
        <div className="ielts-slide-in">
          {renderCurrentPart()}
        </div>
      </div>
    </div>
  );
};