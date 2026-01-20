import { useState } from 'react';

import { Award, Target, BarChart3 } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import BandDescriptor from './BandDescriptor';
import type { Session } from '../../types';

interface ScoresSectionProps {
  session: Session;
  previousSession?: Session;
}

type TabType = 'ielts' | 'toefl' | 'general';

const ScoresSection = ({ session, previousSession }: ScoresSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('ielts');
  const [expandedBand, setExpandedBand] = useState<{ type: 'ielts' | 'toefl'; score: number } | null>(null);

  const tabs: { id: TabType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'ielts', label: 'IELTS', icon: Award, color: 'text-emerald-400' },
    { id: 'toefl', label: 'TOEFL', icon: Target, color: 'text-purple-400' },
    { id: 'general', label: 'General', icon: BarChart3, color: 'text-blue-400' }
  ];

  const toggleBandExpansion = (type: 'ielts' | 'toefl', score: number) => {
    if (expandedBand?.type === type && expandedBand?.score === score) {
      setExpandedBand(null);
    } else {
      setExpandedBand({ type, score });
    }
  };

  const renderIELTSScores = () => {
    if (!session.bandScores) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Award size={48} className="mx-auto mb-3 opacity-50" />
          <p>IELTS scores not available for this session</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Overall Band Score */}
        <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-emerald-300 font-medium">Overall Band Score</h3>
            <ScoreBadge 
              score={session.bandScores.overall} 
              type="ielts" 
              showTrend={!!previousSession?.bandScores}
              previousScore={previousSession?.bandScores?.overall}
            />
          </div>
            <BandDescriptor 
              score={session.bandScores!.overall} 
              type="ielts" 
              expanded={expandedBand?.type === 'ielts' && expandedBand?.score === session.bandScores!.overall}
              onToggle={() => toggleBandExpansion('ielts', session.bandScores!.overall)}
            />
        </div>

        {/* Detailed Component Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-emerald-300 text-sm font-medium">Fluency & Coherence</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.bandScores.fluencyCoherence} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.bandScores}
                  previousScore={previousSession?.bandScores?.fluencyCoherence}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.bandScores.fluencyCoherence >= 7 ? 'Strong performance' : 
               session.bandScores.fluencyCoherence >= 6 ? 'Adequate performance' : 'Needs improvement'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-emerald-300 text-sm font-medium">Lexical Resource</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.bandScores.lexicalResource} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.bandScores}
                  previousScore={previousSession?.bandScores?.lexicalResource}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.bandScores.lexicalResource >= 7 ? 'Wide vocabulary range' : 
               session.bandScores.lexicalResource >= 6 ? 'Adequate vocabulary' : 'Limited vocabulary'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-emerald-300 text-sm font-medium">Grammatical Range</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.bandScores.grammaticalRange} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.bandScores}
                  previousScore={previousSession?.bandScores?.grammaticalRange}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.bandScores.grammaticalRange >= 7 ? 'Complex structures' : 
               session.bandScores.grammaticalRange >= 6 ? 'Basic structures correct' : 'Frequent errors'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-emerald-300 text-sm font-medium">Pronunciation</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.bandScores.pronunciation} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.bandScores}
                  previousScore={previousSession?.bandScores?.pronunciation}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.bandScores.pronunciation >= 7 ? 'Clear and natural' : 
               session.bandScores.pronunciation >= 6 ? 'Generally clear' : 'Often unclear'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTOEFLScores = () => {
    if (!session.toeflScores) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Target size={48} className="mx-auto mb-3 opacity-50" />
          <p>TOEFL scores not available for this session</p>
        </div>
      );
    }

    const averageScore = (session.toeflScores.delivery + session.toeflScores.languageUse + session.toeflScores.topicDevelopment) / 3;
    const prevAverage = previousSession?.toeflScores 
      ? (previousSession.toeflScores.delivery + previousSession.toeflScores.languageUse + previousSession.toeflScores.topicDevelopment) / 3
      : undefined;

    return (
      <div className="space-y-4">
        {/* Overall TOEFL Score */}
        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-purple-300 font-medium">Overall Score</h3>
            <ScoreBadge 
              score={averageScore} 
              type="toefl" 
              showTrend={!!prevAverage}
              previousScore={prevAverage}
            />
          </div>
          <BandDescriptor 
            score={averageScore} 
            type="toefl" 
            expanded={expandedBand?.type === 'toefl' && expandedBand?.score === averageScore}
            onToggle={() => toggleBandExpansion('toefl', averageScore)}
          />
        </div>

        {/* Detailed Component Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-black/30 rounded-lg p-4 border border-purple-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-purple-300 text-sm font-medium">Delivery</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.toeflScores.delivery} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.toeflScores}
                  previousScore={previousSession?.toeflScores?.delivery}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.toeflScores.delivery >= 3 ? 'Clear speech' : 'Needs clarity improvement'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-purple-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-purple-300 text-sm font-medium">Language Use</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.toeflScores.languageUse} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.toeflScores}
                  previousScore={previousSession?.toeflScores?.languageUse}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.toeflScores.languageUse >= 3 ? 'Good vocabulary' : 'Expand vocabulary'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-purple-900/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-purple-300 text-sm font-medium">Topic Development</h4>
              <div className="flex items-center gap-1">
                <ScoreBadge 
                  score={session.toeflScores.topicDevelopment} 
                  type="rubric" 
                  size="sm"
                  showTrend={!!previousSession?.toeflScores}
                  previousScore={previousSession?.toeflScores?.topicDevelopment}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {session.toeflScores.topicDevelopment >= 3 ? 'Well-developed' : 'Needs more depth'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGeneralScores = () => {
    return (
      <div className="space-y-4">
        {/* Confidence Score */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-blue-300 font-medium">Overall Confidence</h3>
            <div className="text-2xl font-bold text-white">
              {session.confidence}%
            </div>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${session.confidence}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {session.confidence >= 85 ? 'Excellent confidence level' : 
             session.confidence >= 70 ? 'Good confidence level' : 'Building confidence'}
          </div>
        </div>

        {/* Rubric Breakdown */}
        {session.rubricBreakdown && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(session.rubricBreakdown).map(([key, data]) => (
              <div key={key} className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-blue-300 text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <span className="text-white font-bold">{data.score}/10</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(data.score / 10) * 100}%` }}
                  />
                </div>
                {data.feedback && (
                  <p className="text-xs text-gray-400 line-clamp-2">{data.feedback}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
            <h4 className="text-blue-300 text-sm font-medium mb-2">Speaking Speed</h4>
            <div className="text-2xl font-bold text-white">{session.speed || 0}</div>
            <div className="text-xs text-gray-400">WPM</div>
            <div className="text-xs text-blue-300 mt-1">
              {session.speed && session.speed < 120 ? 'Too Slow' :
               session.speed && session.speed > 190 ? 'Too Fast' : 'Optimal'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
            <h4 className="text-blue-300 text-sm font-medium mb-2">Filler Words</h4>
            <div className="text-2xl font-bold text-white">{session.fillerPercentage || 0}%</div>
            <div className="text-xs text-gray-400">of total words</div>
            <div className="text-xs text-blue-300 mt-1">
              {session.fillerPercentage && session.fillerPercentage > 15 ? 'High' :
               session.fillerPercentage && session.fillerPercentage > 8 ? 'Moderate' : 'Low'}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
            <h4 className="text-blue-300 text-sm font-medium mb-2">Duration</h4>
            <div className="text-2xl font-bold text-white">
              {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400">minutes</div>
            <div className="text-xs text-blue-300 mt-1">
              {session.duration && session.duration < 60 ? 'Short' :
               session.duration && session.duration > 300 ? 'Long' : 'Good length'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Scores Analysis</h2>
        <div className="flex gap-1 bg-black/30 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasData = 
              tab.id === 'ielts' ? !!session.bandScores :
              tab.id === 'toefl' ? !!session.toeflScores : true;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={!hasData}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${isActive 
                    ? `${tab.color} bg-black/50` 
                    : hasData 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 cursor-not-allowed'
                  }
                `}
                title={hasData ? `View ${tab.label} scores` : `${tab.label} scores not available`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div
        key={activeTab}
      >
        {activeTab === 'ielts' && renderIELTSScores()}
        {activeTab === 'toefl' && renderTOEFLScores()}
        {activeTab === 'general' && renderGeneralScores()}
      </div>
    </div>
  );
};

export default ScoresSection;