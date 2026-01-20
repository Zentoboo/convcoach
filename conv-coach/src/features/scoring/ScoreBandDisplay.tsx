import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreBandDisplayProps {
  bandScores: {
    overall: number;
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  previousScores?: {
    overall: number;
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
}

const ScoreBandDisplay = ({ bandScores, previousScores }: ScoreBandDisplayProps) => {
  const getBandColor = (score: number): string => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-400/20';
    if (score >= 7) return 'text-green-400 bg-green-400/20';
    if (score >= 6) return 'text-yellow-400 bg-yellow-400/20';
    if (score >= 5) return 'text-orange-400 bg-orange-400/20';
    if (score >= 4) return 'text-red-400 bg-red-400/20';
    return 'text-gray-400 bg-gray-400/20';
  };

  const getBandDescription = (score: number): string => {
    if (score >= 8) return 'Expert User';
    if (score >= 7) return 'Good User';
    if (score >= 6) return 'Competent User';
    if (score >= 5) return 'Modest User';
    if (score >= 4) return 'Limited User';
    if (score >= 3) return 'Extremely Limited';
    return 'Non-User';
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (previous === undefined) return null;
    if (current > previous) return <TrendingUp size={14} className="text-emerald-400" />;
    if (current < previous) return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const getProgressWidth = (score: number, maxScore: number = 9): number => {
    return (score / maxScore) * 100;
  };

  const criteria = [
    { key: 'fluencyCoherence', label: 'Fluency & Coherence', description: 'Speech flow and logical connections' },
    { key: 'lexicalResource', label: 'Lexical Resource', description: 'Vocabulary range and precision' },
    { key: 'grammaticalRange', label: 'Grammar Range', description: 'Sentence complexity and accuracy' },
    { key: 'pronunciation', label: 'Pronunciation', description: 'Clarity and intonation' }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30">
      {/* Overall Score */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold text-white mb-2">Overall IELTS Band Score</h3>
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getBandColor(bandScores.overall)} border-2 border-emerald-500/30`}>
          <div className="text-center">
            <div className="text-2xl font-bold">{bandScores.overall.toFixed(1)}</div>
            <div className="text-xs opacity-75">/ 9.0</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">{getBandDescription(bandScores.overall)}</div>
      </div>

      {/* Individual Scores */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold mb-3">Detailed Breakdown</h4>
        {criteria.map((criterion) => {
          const score = bandScores[criterion.key as keyof typeof bandScores];
          const previousScore = previousScores?.[criterion.key as keyof typeof previousScores];
          
          return (
            <motion.div
              key={criterion.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: criteria.indexOf(criterion) * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{criterion.label}</span>
                    {getTrendIcon(score, previousScore)}
                  </div>
                  <div className="text-xs text-gray-400">{criterion.description}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBandColor(score)}`}>
                  {score.toFixed(1)}/9.0
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: getProgressWidth(score) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    score >= 8 ? 'bg-emerald-400' :
                    score >= 7 ? 'bg-green-400' :
                    score >= 6 ? 'bg-yellow-400' :
                    score >= 5 ? 'bg-orange-400' :
                    score >= 4 ? 'bg-red-400' : 'bg-gray-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Band Reference */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <h5 className="text-sm font-medium text-gray-300 mb-3">IELTS Band Reference</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span className="text-gray-400">8.0-9.0 Expert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-400">7.0-7.5 Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-gray-400">6.0-6.5 Competent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-gray-400">5.0-5.5 Modest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBandDisplay;