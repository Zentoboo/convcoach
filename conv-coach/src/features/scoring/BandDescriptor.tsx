import { motion } from 'framer-motion';
import { Info, TrendingUp, Target, AlertCircle } from 'lucide-react';

interface BandDescriptorProps {
  score: number;
  type: 'ielts' | 'toefl';
  expanded?: boolean;
  onToggle?: () => void;
}

const BandDescriptor = ({ score, type, expanded = false, onToggle }: BandDescriptorProps) => {
  const ieltsBands = {
    9: {
      level: 'Expert User',
      description: 'Full operational command of the language with appropriate, accurate and fluent use, and complete understanding.',
      strengths: ['Natural and fluent speech', 'Wide vocabulary range', 'Complex grammar structures', 'Rare pronunciation errors'],
      improvements: ['Maintain this level consistently', 'Continue practicing advanced topics']
    },
    8: {
      level: 'Very Good User',
      description: 'Fully operational command of the language with only occasional unsystematic inaccuracies.',
      strengths: ['Fluent speech with rare hesitation', 'Good vocabulary range', 'Complex grammar mostly accurate'],
      improvements: ['Reduce occasional errors', 'Expand idiomatic expressions', 'Practice stress patterns']
    },
    7: {
      level: 'Good User',
      description: 'Operational command of the language with occasional inaccuracies and misunderstandings.',
      strengths: ['Generally fluent speech', 'Effective communication', 'Reasonable vocabulary range'],
      improvements: ['Reduce hesitation', 'Improve grammatical accuracy', 'Expand vocabulary']
    },
    6: {
      level: 'Competent User',
      description: 'Generally effective command of the language despite some inaccuracies.',
      strengths: ['Can maintain conversation', 'Basic fluency', 'Understands complex topics'],
      improvements: ['Reduce basic errors', 'Improve fluency', 'Practice complex structures']
    },
    5: {
      level: 'Modest User',
      description: 'Partial command of the language, coping with overall meaning in most situations.',
      strengths: ['Basic communication possible', 'Can handle familiar topics'],
      improvements: ['Improve fluency', 'Expand vocabulary', 'Reduce grammatical errors']
    },
    4: {
      level: 'Limited User',
      description: 'Basic competence is limited to familiar situations with frequent breakdowns.',
      strengths: ['Can communicate basic needs'],
      improvements: ['Focus on basic fluency', 'Build core vocabulary', 'Practice sentence structures']
    }
  };

  const toeflLevels = {
    4: {
      level: 'Advanced',
      description: 'Demonstrates generally effective use of language at an advanced level, with clear expression, coherence, and completeness.',
      strengths: ['Clear and coherent speech', 'Good development of topics', 'Effective use of language'],
      improvements: ['Refine pronunciation', 'Enhance vocabulary sophistication', 'Practice complex discussions']
    },
    3: {
      level: 'High-Intermediate',
      description: 'Demonstrates effective use of language at a high-intermediate level, with some limitations in expression or development.',
      strengths: ['Generally clear expression', 'Adequate topic development', 'Good communication skills'],
      improvements: ['Reduce pronunciation issues', 'Expand vocabulary', 'Improve topic development']
    },
    2: {
      level: 'Intermediate',
      description: 'Demonstrates basic use of language with limitations in expression, development, and language use.',
      strengths: ['Basic communication', 'Simple topic development'],
      improvements: ['Improve fluency', 'Expand vocabulary significantly', 'Practice complex grammar']
    },
    1: {
      level: 'Basic',
      description: 'Demonstrates limited use of language with significant difficulties in expression and development.',
      strengths: ['Can express basic ideas'],
      improvements: ['Focus on basic fluency', 'Build core vocabulary', 'Practice pronunciation']
    }
  };

  const getBandInfo = () => {
    if (type === 'ielts') {
      const band = Math.min(Math.max(Math.floor(score), 4), 9);
      return ieltsBands[band as keyof typeof ieltsBands];
    } else {
      const level = Math.min(Math.max(Math.ceil(score), 1), 4);
      return toeflLevels[level as keyof typeof toeflLevels];
    }
  };

  const getColorClass = () => {
    if (type === 'ielts') {
      if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      if (score >= 7) return 'bg-green-500/20 text-green-400 border-green-500/30';
      if (score >= 6) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      if (score >= 5) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else {
      if (score >= 4) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      if (score >= 3) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      if (score >= 2) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const bandInfo = getBandInfo();

  if (!expanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${getColorClass()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info size={18} />
            <div>
              <div className="font-semibold">
                {type === 'ielts' ? `Band ${score.toFixed(1)}` : `Score ${score.toFixed(1)}/4.0`}
              </div>
              <div className="text-sm opacity-75">{bandInfo.level}</div>
            </div>
          </div>
          <div className="text-xs opacity-60">
            Click to view details
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`p-6 rounded-lg border ${getColorClass()}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Info size={20} />
          <div>
            <div className="font-semibold text-lg">
              {type === 'ielts' ? `IELTS Band ${score.toFixed(1)}` : `TOEFL Score ${score.toFixed(1)}/4.0`}
            </div>
            <div className="text-sm opacity-75">{bandInfo.level}</div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          Show less
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed">{bandInfo.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-400" />
              <h4 className="font-medium text-sm">Strengths</h4>
            </div>
            <ul className="space-y-1">
              {bandInfo.strengths.map((strength, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-yellow-400" />
              <h4 className="font-medium text-sm">Areas for Improvement</h4>
            </div>
            <ul className="space-y-1">
              {bandInfo.improvements.map((improvement, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-black/20 rounded-lg">
          <AlertCircle size={16} className="text-blue-400 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {type === 'ielts' 
              ? `This assessment is based on the official IELTS Speaking band descriptors. Focus on the improvement areas to progress to higher bands.`
              : `This assessment aligns with TOEFL iBT Speaking scoring criteria. Continue practicing to achieve higher levels of proficiency.`
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BandDescriptor;