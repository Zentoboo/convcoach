import { motion } from 'framer-motion';

interface ScoreBadgeProps {
  score: number;
  type: 'ielts' | 'toefl' | 'rubric';
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousScore?: number;
  label?: string;
  className?: string;
}

const ScoreBadge = ({ 
  score, 
  type, 
  size = 'md', 
  showTrend = false, 
  previousScore,
  label,
  className = ''
}: ScoreBadgeProps) => {
  const getIELTSColor = (score: number): string => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 7) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 6) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 5) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (score >= 4) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTOEFLColor = (score: number): string => {
    if (score >= 4) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (score >= 3) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (score >= 2) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRubricColor = (score: number, maxScore: number = 10): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (percentage >= 70) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (percentage >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (percentage >= 50) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getIELTSDesc = (score: number): string => {
    if (score >= 8) return 'Expert';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Competent';
    if (score >= 5) return 'Modest';
    if (score >= 4) return 'Limited';
    return 'Very Limited';
  };

  const getTOEFLDesc = (score: number): string => {
    if (score >= 4) return 'Advanced';
    if (score >= 3) return 'High-Int';
    if (score >= 2) return 'Int';
    return 'Basic';
  };

  const getColorClass = (): string => {
    switch (type) {
      case 'ielts':
        return getIELTSColor(score);
      case 'toefl':
        return getTOEFLColor(score);
      case 'rubric':
        return getRubricColor(score);
      default:
        return getIELTSColor(score);
    }
  };

  const getScoreDisplay = (): string => {
    switch (type) {
      case 'ielts':
        return `${score.toFixed(1)}/9.0`;
      case 'toefl':
        return `${score.toFixed(1)}/4.0`;
      case 'rubric':
        return `${score}/10`;
      default:
        return `${score.toFixed(1)}`;
    }
  };

  const getLevelDesc = (): string => {
    switch (type) {
      case 'ielts':
        return getIELTSDesc(score);
      case 'toefl':
        return getTOEFLDesc(score);
      case 'rubric':
        const percentage = (score / 10) * 100;
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 70) return 'Good';
        if (percentage >= 60) return 'Fair';
        if (percentage >= 50) return 'Poor';
        return 'Very Poor';
      default:
        return '';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getTrendIndicator = () => {
    if (!showTrend || previousScore === undefined) return null;
    
    if (score > previousScore) {
      return (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 text-emerald-400 text-xs"
        >
          ↑
        </motion.span>
      );
    } else if (score < previousScore) {
      return (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 text-red-400 text-xs"
        >
          ↓
        </motion.span>
      );
    } else {
      return (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 text-gray-400 text-xs"
        >
          →
        </motion.span>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-2 border rounded-lg font-medium
        transition-all duration-200 hover:scale-105
        ${getColorClass()}
        ${getSizeClasses()}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label && (
        <span className="opacity-75">{label}:</span>
      )}
      
      <span className="font-bold">
        {getScoreDisplay()}
      </span>
      
      {getTrendIndicator()}
      
      {size !== 'sm' && type !== 'rubric' && (
        <span className="text-xs opacity-75">
          {getLevelDesc()}
        </span>
      )}
    </motion.div>
  );
};

export default ScoreBadge;