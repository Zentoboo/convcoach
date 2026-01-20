import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Calendar } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import type { Session } from '../../types';

interface ProgressTrackerProps {
  currentSession: Session;
  previousSessions: Session[];
}

const ProgressTracker = ({ currentSession, previousSessions }: ProgressTrackerProps) => {
  const getProgressIcon = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    
    if (current > previous) {
      return <TrendingUp size={14} className="text-emerald-400" />;
    } else if (current < previous) {
      return <TrendingDown size={14} className="text-red-400" />;
    } else {
      return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getProgressColor = (current: number, previous: number | undefined) => {
    if (previous === undefined) return 'text-gray-400';
    
    const diff = current - previous;
    if (diff > 0.5) return 'text-emerald-400';
    if (diff < -0.5) return 'text-red-400';
    return 'text-gray-400';
  };



  const getTargetGap = (current: number, target: number, type: 'ielts' | 'toefl') => {
    const gap = target - current;
    if (gap <= 0) return null;
    
    if (type === 'ielts') {
      return `+${gap.toFixed(1)} to Band ${target.toFixed(1)}`;
    } else {
      return `+${gap.toFixed(1)} to ${target.toFixed(1)}/4.0`;
    }
  };

  const getTrendMessage = (sessions: Session[], metric: keyof Session) => {
    if (sessions.length < 2) return 'Insufficient data';
    
    const recent = sessions.slice(-3).map(s => s[metric] as number);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    
    if (avg > (recent[0] || 0)) return 'Improving';
    if (avg < (recent[0] || 0)) return 'Declining';
    return 'Stable';
  };

  const previousSession = previousSessions[0]; // Most recent previous session
  const allSessions = [currentSession, ...previousSessions];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Calendar size={20} className="mr-2 text-emerald-400" />
        Progress & Trends
      </h2>

      {/* Quick Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm">Performance Trend</h3>
            <span className="text-xs text-gray-400">
              {previousSession ? 'Last ' + Math.min(3, previousSessions.length + 1) + ' sessions' : 'Current session only'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-2xl font-bold text-emerald-400">
                {getTrendMessage(allSessions, 'confidence')}
              </div>
              <div className="text-xs text-gray-400">
                Based on recent confidence scores
              </div>
            </div>
            {previousSession && (
              <div className={`text-lg font-medium ${getProgressColor(currentSession.confidence, previousSession.confidence)}`}>
                {(currentSession.confidence - previousSession.confidence).toFixed(0)}%
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm">Session Consistency</h3>
            <span className="text-xs text-gray-400">
              {allSessions.length} total sessions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-400">
                {allSessions.length >= 3 ? 'Regular' : allSessions.length >= 1 ? 'Building' : 'Starting'}
              </div>
              <div className="text-xs text-gray-400">
                Practice consistency level
              </div>
            </div>
            <div className="text-lg font-medium text-blue-400">
              {allSessions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Score Progress */}
      {currentSession.bandScores && (
        <div className="mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <Target size={16} className="mr-2 text-emerald-400" />
            IELTS Band Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-300">Overall</span>
                {getProgressIcon(currentSession.bandScores.overall, previousSession?.bandScores?.overall)}
              </div>
              <ScoreBadge 
                score={currentSession.bandScores.overall} 
                type="ielts" 
                size="sm"
                showTrend={!!previousSession?.bandScores}
                previousScore={previousSession?.bandScores?.overall}
              />
            </div>

            <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-300">Fluency</span>
                {getProgressIcon(currentSession.bandScores.fluencyCoherence, previousSession?.bandScores?.fluencyCoherence)}
              </div>
              <ScoreBadge 
                score={currentSession.bandScores.fluencyCoherence} 
                type="rubric" 
                size="sm"
                showTrend={!!previousSession?.bandScores}
                previousScore={previousSession?.bandScores?.fluencyCoherence}
              />
            </div>

            <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-300">Vocabulary</span>
                {getProgressIcon(currentSession.bandScores.lexicalResource, previousSession?.bandScores?.lexicalResource)}
              </div>
              <ScoreBadge 
                score={currentSession.bandScores.lexicalResource} 
                type="rubric" 
                size="sm"
                showTrend={!!previousSession?.bandScores}
                previousScore={previousSession?.bandScores?.lexicalResource}
              />
            </div>

            <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-300">Grammar</span>
                {getProgressIcon(currentSession.bandScores.grammaticalRange, previousSession?.bandScores?.grammaticalRange)}
              </div>
              <ScoreBadge 
                score={currentSession.bandScores.grammaticalRange} 
                type="rubric" 
                size="sm"
                showTrend={!!previousSession?.bandScores}
                previousScore={previousSession?.bandScores?.grammaticalRange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Target Gaps */}
      <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <Target size={16} className="mr-2 text-yellow-400" />
          Target Analysis
        </h3>
        <div className="space-y-2">
          {currentSession.bandScores && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">IELTS Target (Band 7.0)</span>
              <span className="text-sm font-medium text-yellow-400">
                {getTargetGap(currentSession.bandScores.overall, 7.0, 'ielts') || 'Target achieved!'}
              </span>
            </div>
          )}
          
          {currentSession.toeflScores && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">TOEFL Target (3.5/4.0)</span>
              <span className="text-sm font-medium text-purple-400">
                {getTargetGap(
                  (currentSession.toeflScores.delivery + currentSession.toeflScores.languageUse + currentSession.toeflScores.topicDevelopment) / 3, 
                  3.5, 
                  'toefl'
                ) || 'Target achieved!'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Confidence Target (85%)</span>
            <span className="text-sm font-medium text-blue-400">
              {currentSession.confidence >= 85 ? 'Target achieved!' : `+${85 - currentSession.confidence}% to target`}
            </span>
          </div>
        </div>
      </div>

      {!previousSession && (
        <div className="mt-4 p-3 bg-emerald-900/10 rounded-lg border border-emerald-900/20">
          <p className="text-xs text-emerald-300">
            Continue practicing to unlock detailed progress tracking and trend analysis.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressTracker;