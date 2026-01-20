import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';
import type { Session } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../constants';
import ScoresSection from '../scoring/ScoresSection';
import ProgressTracker from '../scoring/ProgressTracker';
import MetricsDashboard from './MetricsDashboard';
import AnalysisSection from './AnalysisSection';
import SpeechTimelineChart from '../analytics/SpeechTimelineChart';
import DeleteConfirmation from './DeleteConfirmation';

interface SessionDetailViewProps {
  session: Session | null;
  customFillers: string[];
  previousSessions: Session[];
  onBack: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  onConfirmDelete: () => void;
  error: string | null;
  loading?: boolean;
}

const SessionDetailView = ({
  session,
  customFillers,
  previousSessions,
  onBack,
  showDeleteConfirm,
  setShowDeleteConfirm,
  onConfirmDelete,
  error,
  loading = false
}: SessionDetailViewProps) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Session not found</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // Create JSON download of session data
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-${session.date.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Coaching Session - ${session.date}`,
          text: `Confidence: ${session.confidence}% | Language: ${SUPPORTED_LANGUAGES.find((l: any) => l.code === session.language)?.name || session.language}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      const text = `Coaching Session - ${session.date}\nConfidence: ${session.confidence}%\nLanguage: ${SUPPORTED_LANGUAGES.find((l: any) => l.code === session.language)?.name || session.language}\n\nTranscript:\n${session.transcript}`;
      await navigator.clipboard.writeText(text);
      alert('Session details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to History
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center px-3 py-2 bg-black/40 backdrop-blur-md text-blue-300 rounded-lg border border-blue-900/30 hover:bg-blue-900/20 transition-all"
              title="Download session data"
            >
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Download</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center px-3 py-2 bg-black/40 backdrop-blur-md text-purple-300 rounded-lg border border-purple-900/30 hover:bg-purple-900/20 transition-all"
              title="Share session"
            >
              <Share2 size={16} className="mr-2" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-3 py-2 bg-black/40 backdrop-blur-md text-rose-300 rounded-lg border border-rose-900/30 hover:bg-rose-900/20 transition-all"
              title="Delete session"
            >
              <Trash2 size={16} className="mr-2" />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Session Metadata Header - Clean and Minimal */}
        <div className="mb-6 p-4 bg-black/40 backdrop-blur-xl rounded-xl border border-emerald-900/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{session.date}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-300">
                  Language: <span className="text-white font-medium">
                    {SUPPORTED_LANGUAGES.find((l: any) => l.code === session.language)?.name || session.language}
                  </span>
                </span>
                <span className="text-gray-300">
                  Duration: <span className="text-white font-medium">
                    {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
                  </span>
                </span>
                <span className="text-gray-300">
                  Confidence: <span className="text-white font-medium">{session.confidence}%</span>
                </span>
              </div>
              {session.topic && (
                <p className="text-emerald-300 text-sm mt-2">
                  Topic: <span className="text-emerald-100">{session.topic}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Session Content - Reorganized Structure */}
        <div className="space-y-6">
          {/* Scores Analysis Section */}
          <ScoresSection 
            session={session} 
            previousSession={previousSessions[0]}
          />

          {/* Progress & Trends */}
          {previousSessions.length > 0 && (
            <ProgressTracker 
              currentSession={session}
              previousSessions={previousSessions}
            />
          )}

          {/* Metrics Dashboard */}
          <MetricsDashboard 
            session={session}
            previousSession={previousSessions[0]}
          />

          {/* Speech Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Speech Timeline Analysis</h2>
            <SpeechTimelineChart
              timelineData={session.timeline || []}
              customFillers={customFillers}
              sessionId={session._id}
            />
          </motion.div>

          {/* Analysis Section - Combined Transcript and Feedback */}
          <AnalysisSection session={session} />
        </div>

        {/* Delete Confirmation */}
        <DeleteConfirmation
          showConfirm={showDeleteConfirm}
          setShowConfirm={setShowDeleteConfirm}
          onConfirm={onConfirmDelete}
          title="Delete Session"
          message="Are you sure you want to delete this coaching session? This action cannot be undone."
          confirmText="Delete"
        />
      </motion.div>
    </div>
  );
};

export default SessionDetailView;