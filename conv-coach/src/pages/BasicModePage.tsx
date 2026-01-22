import React from 'react';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import ErrorDisplay from '../components/ErrorDisplay';
import SessionRecording from '../features/recording/SessionRecording';
import PerformanceMetrics from '../features/analytics/PerformanceMetrics';
import SpeechTimeline from '../features/analytics/SpeechTimeline';
import AIFeedback from '../features/recording/AIFeedback';

interface BasicModePageProps {
  speechState: any;
  settings: any;
  sessionTopic: string;
  setSessionTopic: (topic: string) => void;
  sessionId: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  triggerAIAnalysis: boolean;
  error: string | null;
}

const BasicModePage: React.FC<BasicModePageProps> = ({
  speechState,
  settings,
  sessionTopic,
  setSessionTopic,
  sessionId,
  startRecording,
  stopRecording,
  triggerAIAnalysis,
  error
}) => {
  return (
    <LayoutWrapper showFooter={true}>
      <div className="space-y-6">
        <ErrorDisplay error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SessionRecording
            isRecording={speechState.isRecording}
            isAnalyzing={speechState.isAnalyzing}
            sessionTopic={sessionTopic}
            setSessionTopic={setSessionTopic}
            transcript={speechState.transcript}
            selectedLanguage={settings.selectedLanguage}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />

          <PerformanceMetrics
            speakingSpeed={speechState.speakingSpeed}
            fillerPercentage={speechState.fillerPercentage}
            confidenceScore={speechState.confidenceScore}
            feedback={speechState.feedback}
          />
        </div>

        <SpeechTimeline
          timelineData={speechState.timelineData}
          customFillers={settings.customFillers}
        />

        <AIFeedback
          transcript={speechState.transcript}
          speed={speechState.speakingSpeed}
          fillerPercentage={speechState.fillerPercentage}
          confidence={speechState.confidenceScore}
          topic={sessionTopic}
          sessionId={sessionId}
          triggerAnalysis={triggerAIAnalysis}
          onAnalysisComplete={() => {}}
        />
      </div>
    </LayoutWrapper>
  );
};

export default BasicModePage;