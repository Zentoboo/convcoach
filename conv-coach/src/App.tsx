

// Components
import Header from './components/Header';
import ErrorDisplay from './components/ErrorDisplay';
import SessionRecording from './features/recording/SessionRecording';
import PerformanceMetrics from './features/analytics/PerformanceMetrics';
import SpeechTimeline from './features/analytics/SpeechTimeline';
import SessionHistory from './features/history/SessionHistory';
import SessionDetailView from './features/history/SessionDetailView';
import SettingsModal from './features/settings/SettingsModal';
import AIFeedback from './features/recording/AIFeedback';

// Hooks
import { useSettings } from './features/settings/hooks/useSettings';
import { useSessionHistory } from './features/history/hooks/useSessionHistory';
import { useSpeechRecognition } from './features/recording/hooks/useSpeechRecognition';

const App = () => {
  // Settings
  const {
    settings,
    showSettings,
    setShowSettings,
    newFillerWord,
    setNewFillerWord,
    handleLanguageChange,
    handleAddFiller,
    handleRemoveFiller,
    resetFillersToDefaults,
    currentLanguage
  } = useSettings();

  // Session History
  const {
    showHistory,
    setShowHistory,
    currentPage,
    setCurrentPage,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showClearMenu,
    setShowClearMenu,
    clearType,
    setClearType,
    showClearConfirm,
    setShowClearConfirm,
    paginatedHistory,
    totalPages,
    handleDeleteSession,
    handleClearHistory,
    showSessionDetail,
    viewSessionDetails,
    closeSessionDetails,
    getSelectedSession,
    getPreviousSessions,
    filters,
    setFilters,
    setSessionToDelete
  } = useSessionHistory();

  // Speech Recognition
  const {
    state: speechState,
    error,
    sessionTopic,
    setSessionTopic,
    sessionId,
    startRecording,
    stopRecording,
    triggerAIAnalysis
  } = useSpeechRecognition({
    selectedLanguage: settings.selectedLanguage,
    customFillers: settings.customFillers
  });





  const handleDeleteSessionClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setShowDeleteConfirm(true);
  };

  const handleShowClearMenu = () => {
    setShowClearMenu(true);
  };



  const handleSelectClearType = (type: string) => {
    setClearType(type);
    setShowClearConfirm(true);
    setShowClearMenu(false);
  };

  const handleViewSessionDetails = (sessionId: string) => {
    viewSessionDetails(sessionId);
  };

  const handleCloseSessionDetails = () => {
    closeSessionDetails();
  };

  // Show session detail view
  if (showSessionDetail) {
    const selectedSession = getSelectedSession();
    const previousSessions = selectedSession ? getPreviousSessions(selectedSession._id) : [];
    
    return (
      <SessionDetailView
        session={selectedSession}
        customFillers={settings.customFillers}
        previousSessions={previousSessions}
        onBack={handleCloseSessionDetails}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        onConfirmDelete={handleDeleteSession}
        error={error}
      />
    );
  }

  // Show history view
  if (showHistory) {
    return (
      <SessionHistory
        paginatedHistory={paginatedHistory}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        customFillers={settings.customFillers}
        showDeleteConfirm={showDeleteConfirm}
        showClearMenu={showClearMenu}
        showClearConfirm={showClearConfirm}
        clearType={clearType}
        onBackToCoach={() => setShowHistory(false)}
        onDeleteSession={handleDeleteSessionClick}
        onConfirmDelete={handleDeleteSession}
        onShowClearMenu={handleShowClearMenu}

        onSelectClearType={handleSelectClearType}
        onConfirmClear={handleClearHistory}
        onViewDetails={handleViewSessionDetails}
        error={error}
        filters={filters}
        onFiltersChange={setFilters}
      />
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          onShowSettings={() => setShowSettings(true)}
          onShowHistory={() => setShowHistory(true)}
        />

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

        <SettingsModal
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          selectedLanguage={settings.selectedLanguage}
          customFillers={settings.customFillers}
          newFillerWord={newFillerWord}
          setNewFillerWord={setNewFillerWord}
          onLanguageChange={handleLanguageChange}
          onAddFiller={handleAddFiller}
          onRemoveFiller={handleRemoveFiller}
          onResetFillers={resetFillersToDefaults}
          currentLanguageName={currentLanguage.name}
        />
      </div>
    </div>
  );
};

export default App;