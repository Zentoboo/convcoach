// Import styles first
import './index.css'; // This imports tokens and modes CSS

// Layout Components
import LayoutWrapper from './components/layout/LayoutWrapper';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';

// Page Components
import HomePage from './components/HomePage';
import BasicModePage from './pages/BasicModePage';
import IELTSModePage from './pages/IELTSModePage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import SessionDetailView from './features/history/SessionDetailView';

// These are now imported in individual page components

// Router
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';

// Hooks
import { useSettings } from './features/settings/hooks/useSettings';
import { useSessionHistory } from './features/history/hooks/useSessionHistory';
import { useSpeechRecognition } from './features/recording/hooks/useSpeechRecognition';

// Component to handle location-dependent logic
const AppContent = () => {
  const location = useLocation();
  const { showDeleteConfirm, closeDeleteConfirm, showClearConfirm, closeClearConfirm } = useNavigation();

  // Settings
  const {
    settings
  } = useSettings();

  // Session History
  const {
    showSessionDetail,
    closeSessionDetails,
    getSelectedSession,
    getPreviousSessions
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

  // Handle session details view
  if (showSessionDetail) {
    const selectedSession = getSelectedSession();
    const previousSessions = selectedSession ? getPreviousSessions(selectedSession._id) : [];
    
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SessionDetailView
              session={selectedSession}
              customFillers={settings.customFillers}
              previousSessions={previousSessions}
              onBack={closeSessionDetails}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={closeDeleteConfirm}
              onConfirmDelete={() => {}}
              error={error}
            />
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  // Determine if we should show footer based on route
  const showFooter = location.pathname !== '/';

  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route 
          path="/" 
          element={
            <LayoutWrapper showFooter={showFooter}>
              <HomePage />
            </LayoutWrapper>
          } 
        />
        
        {/* Basic Mode */}
        <Route 
          path="/basic" 
          element={
            <BasicModePage 
              speechState={speechState}
              settings={settings}
              sessionTopic={sessionTopic}
              setSessionTopic={setSessionTopic}
              sessionId={sessionId}
              startRecording={startRecording}
              stopRecording={stopRecording}
              triggerAIAnalysis={triggerAIAnalysis}
              error={error}
            />
          } 
        />
        
        {/* IELTS Mode */}
        <Route 
          path="/ielts" 
          element={
            <IELTSModePage 
              onBackToHome={() => window.location.href = '/'}
            />
          } 
        />
        
        {/* Settings Page */}
        <Route 
          path="/settings" 
          element={
            <SettingsPage />
          } 
        />
        
        {/* History Page */}
        <Route 
          path="/history" 
          element={
            <HistoryPage />
          } 
        />
        
        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Confirmation Modals Only */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-secondary mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-surface-elevated text-secondary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-error text-white hover:bg-error-dark transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Clear</h3>
            <p className="text-secondary mb-6">Are you sure you want to clear history? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeClearConfirm}
                className="px-4 py-2 rounded-lg bg-surface-elevated text-secondary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={closeClearConfirm}
                className="px-4 py-2 rounded-lg bg-error text-white hover:bg-error-dark transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <NavigationProvider>
        <div className="min-h-screen flex flex-col">
          {/* Global Header - Always Visible */}
          <AppHeader />
          
          {/* Main Content */}
          <main className="flex-1">
            <AppContent />
          </main>
          
          {/* Global Footer */}
          <AppFooter />
        </div>
      </NavigationProvider>
    </Router>
  );
};

export default App;