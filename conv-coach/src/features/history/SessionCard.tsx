
import { BarChart2, Brain, Lightbulb } from 'lucide-react';
import type { Session, TimelineData } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../constants';
import SpeechTimelineChart from '../analytics/SpeechTimelineChart';
import ScoreBadge from '../scoring/ScoreBadge';

interface SessionCardProps {
  session: Session;
  customFillers: string[];
  previousSession?: Session;
  showDetailedScores?: boolean;
}

const SessionCard = ({ 
  session, 
  customFillers, 
  showDetailedScores = false 
}: SessionCardProps) => {
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

  return (
    <div
      key={session._id}
      className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >


      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{session.date}</h3>
          <p className="text-emerald-400/80 text-sm">
            Language: {SUPPORTED_LANGUAGES.find((l: any) => l.code === session.language)?.name || session.language}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-md text-sm font-medium ${getConfidenceColor(session.confidence)}`}>
          Confidence: {session.confidence}%
        </div>
      </div>

      {/* Enhanced Metrics Grid with Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-emerald-900/20">
          <div className="flex items-center text-emerald-400 mb-1">
            <BarChart2 size={16} className="mr-1" />
            <span className="text-xs font-medium">Speed</span>
          </div>
          <p className="text-lg font-bold text-white">{session.speed || 0} WPM</p>
          <p className="text-gray-400 text-xs">{getSpeedStatus(session.speed || 0)}</p>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-emerald-900/20">
          <div className="flex items-center text-emerald-400 mb-1">
            <Lightbulb size={16} className="mr-1" />
            <span className="text-xs font-medium">Fillers</span>
          </div>
          <p className="text-lg font-bold text-white">{session.fillerPercentage || 0}%</p>
          <p className="text-gray-400 text-xs">{getFillerStatus(session.fillerPercentage || 0)}</p>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-emerald-900/20">
          <div className="flex items-center text-emerald-400 mb-1">
            <div className="mr-1 w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium">Duration</span>
          </div>
          <p className="text-lg font-bold text-white">
            {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
          </p>
          <p className="text-gray-400 text-xs">Minutes</p>
        </div>


      </div>

      <>
        <h4 className="text-white font-medium mb-3 text-sm flex items-center">
          <BarChart2 size={16} className="mr-2 text-emerald-400" />
          Speech Timeline ({session.timeline?.length || 0} data points)
        </h4>
        <SpeechTimelineChart
          timelineData={session.timeline as TimelineData[] || []}
          customFillers={customFillers}
          sessionId={session._id}
        />
      </>

      {/* Topic with Skills Preview */}
      <div className="mb-4">
        {session.topic && (
          <div className="p-3 bg-emerald-900/20 border-l-2 border-emerald-500 rounded-r-md">
            <p className="text-sm text-emerald-300">
              <span className="font-medium">Session Topic:</span> {session.topic}
            </p>
          </div>
        )}

        {/* Quick Skills Preview - Only show scores if detailed view is not enabled */}
        {!showDetailedScores && session.bandScores && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            <ScoreBadge score={session.bandScores.fluencyCoherence} type="rubric" size="sm" label="Fluency" />
            <ScoreBadge score={session.bandScores.lexicalResource} type="rubric" size="sm" label="Vocabulary" />
            <ScoreBadge score={session.bandScores.grammaticalRange} type="rubric" size="sm" label="Grammar" />
            <ScoreBadge score={session.bandScores.pronunciation} type="rubric" size="sm" label="Pronunciation" />
          </div>
        )}
      </div>

      {/* Expandable Content */}
      <div className="pt-2 mt-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-white font-medium mb-2 text-sm">Transcript</h4>
            <p className="text-gray-300 line-clamp-3 text-sm">{session.transcript}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2 text-sm">Quick Feedback</h4>
            <p className="text-gray-300 whitespace-pre-line text-sm">{session.feedback}</p>
          </div>
        </div>

        {/* Quick AI Insights Preview - Only for non-detailed view */}
        {!showDetailedScores && session.aiFeedback && (
          <div className="mt-4 p-3 bg-emerald-900/10 rounded-lg border border-emerald-900/20">
            <h4 className="text-white font-medium mb-2 text-sm flex items-center">
              <Brain size={16} className="mr-2 text-emerald-400" />
              AI Insights Summary
            </h4>
            <div className="text-gray-300 text-sm">
              {/* Show only first 2 paragraphs as preview */}
              {session.aiFeedback.split('\n\n').slice(0, 2).join('\n\n')}
              {session.aiFeedback.split('\n\n').length > 2 && (
                <span className="text-emerald-400 italic"> ... (view details for full analysis)</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;