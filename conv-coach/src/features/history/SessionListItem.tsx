
import { BarChart2, Lightbulb, X, Eye, Clock } from 'lucide-react';
import type { Session } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../constants';
import ScoreBadge from '../scoring/ScoreBadge';

interface SessionListItemProps {
  session: Session;
  onDeleteSession: (sessionId: string) => void;
  onViewDetails: (sessionId: string) => void;
  previousSession?: Session;
}

const SessionListItem = ({
  session,
  onDeleteSession,
  onViewDetails,
  previousSession
}: SessionListItemProps) => {
  const getSpeedStatus = (speed: number) => {
    if (speed < 120) return 'Too Slow';
    if (speed < 150) return 'Slightly Slow';
    if (speed > 220) return 'Too Fast';
    if (speed > 190) return 'Slightly Fast';
    return 'Optimal';
  };

  const getFillerStatus = (percentage: number) => {
    if (percentage > 15) return 'High';
    if (percentage > 8) return 'Moderate';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-emerald-500/20 text-emerald-300';
    if (confidence >= 70) return 'bg-amber-500/20 text-amber-300';
    return 'bg-rose-500/20 text-rose-300';
  };

  const getIELTSScore = () => {
    if (session.bandScores) {
      return {
        value: session.bandScores.overall,
        type: 'ielts' as const,
        label: 'IELTS'
      };
    }
    return null;
  }
  const getTOEFLScore = () => {
    if (session.toeflScores) {
      const avgScore = (session.toeflScores.delivery + session.toeflScores.languageUse + session.toeflScores.topicDevelopment) / 3;
      return {
        value: avgScore,
        type: 'toefl' as const,
        label: 'TOEFL'
      };
    }
    return null;
  };

  const IELTSScore = getIELTSScore();
  const TOEFLScore = getTOEFLScore();

  return (
    <div
      key={session._id}
      onClick={() => onViewDetails(session._id)}
      className="bg-gray-900/60 backdrop-blur-xl rounded-lg p-4 border border-emerald-900/20 hover:border-emerald-800/50 transition-all duration-300 cursor-pointer group"
    >
      {/* Header Row */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {session.date}
              </h3>
              <p className="text-gray-400 text-sm">
                {SUPPORTED_LANGUAGES.find((l: any) => l.code === session.language)?.name || session.language}
              </p>
            </div>

            {session.topic && (
              <div className="hidden md:block">
                <span className="text-sm text-emerald-300 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-800/30">
                  {session.topic.slice(0, 50)}{session.topic.length > 50 ? '...' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-md text-sm font-medium ${getConfidenceColor(session.confidence)}`}>
            {session.confidence}%
          </div>

          {IELTSScore && (
            <div>
              <ScoreBadge
                score={IELTSScore.value}
                type={IELTSScore.type}
                size="sm"
                showTrend={!!previousSession?.bandScores}
                previousScore={previousSession?.bandScores?.overall}
                className="justify-center"
              />
            </div>
          )}
          {TOEFLScore && (
            <div>
              <ScoreBadge
                score={TOEFLScore.value}
                type={TOEFLScore.type}
                size="sm"
                showTrend={!!previousSession?.toeflScores}
                previousScore={previousSession?.toeflScores ? (previousSession.toeflScores.delivery + previousSession.toeflScores.languageUse + previousSession.toeflScores.topicDevelopment) / 3 : undefined}
                className="justify-center"
              />
            </div>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(session._id);
              }}
              className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-full transition-colors"
              title="View details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session._id);
              }}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 rounded-full transition-colors"
              title="Delete session"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center text-gray-300">
          <BarChart2 size={16} className="mr-2 text-emerald-400" />
          <div>
            <span className="text-white font-medium">{session.speed || 0} WPM</span>
            <span className="text-xs text-gray-400 ml-1">({getSpeedStatus(session.speed || 0)})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-300">
          <Lightbulb size={16} className="mr-2 text-emerald-400" />
          <div>
            <span className="text-white font-medium">{session.fillerPercentage || 0}%</span>
            <span className="text-xs text-gray-400 ml-1">({getFillerStatus(session.fillerPercentage || 0)})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-300">
          <Clock size={16} className="mr-2 text-emerald-400" />
          <span className="text-white font-medium">
            {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center text-gray-300">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
          <span className="text-white font-medium">{session.timeline?.length || 0} data points</span>
        </div>
      </div>

      {/* Mobile Topic Display */}
      {session.topic && (
        <div className="md:hidden mt-3">
          <span className="text-xs text-emerald-300 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-800/30">
            Topic: {session.topic.slice(0, 30)}{session.topic.length > 30 ? '...' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default SessionListItem;