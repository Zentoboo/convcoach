
import { BarChart2, Lightbulb } from 'lucide-react';
import MetricsProgressBar from './MetricsProgressBar';

interface PerformanceMetricsProps {
  speakingSpeed: number;
  fillerPercentage: number;
  confidenceScore: number;
  feedback: string;
}

const PerformanceMetrics = ({
  speakingSpeed,
  fillerPercentage,
  confidenceScore,
  feedback
}: PerformanceMetricsProps) => {
  
  const getSpeedColor = () => {
    if (speakingSpeed === 0) return "bg-gray-500";
    if (speakingSpeed < 120) return "bg-red-500";
    if (speakingSpeed < 150) return "bg-orange-500";
    if (speakingSpeed > 220) return "bg-red-500";
    if (speakingSpeed > 190) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const getFillerColor = () => {
    if (fillerPercentage === 0) return "bg-emerald-500";
    if (fillerPercentage > 15) return "bg-red-500";
    if (fillerPercentage > 8) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getConfidenceColor = () => {
    if (confidenceScore === 0) return "bg-gray-500";
    if (confidenceScore > 85) return "bg-emerald-500";
    if (confidenceScore > 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const getSpeedStatus = () => {
    if (speakingSpeed === 0) return 'Not speaking';
    if (speakingSpeed < 120) return 'Too slow (< 120 WPM)';
    if (speakingSpeed < 150) return 'Slightly slow (120-150 WPM)';
    if (speakingSpeed > 220) return 'Too fast (> 220 WPM)';
    if (speakingSpeed > 190) return 'Slightly fast (190-220 WPM)';
    return 'Optimal pace (150-190 WPM)';
  };

  const getFillerStatus = () => {
    if (fillerPercentage === 0) return 'No fillers detected';
    if (fillerPercentage > 15) return 'High usage';
    if (fillerPercentage > 8) return 'Moderate usage';
    return 'Minimal usage';
  };

  const getConfidenceStatus = () => {
    if (confidenceScore === 0) return 'Not calculated';
    if (confidenceScore > 85) return 'Excellent';
    if (confidenceScore > 70) return 'Good';
    return 'Needs improvement';
  };

  return (
    <div
      className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      <h2 className="text-xl font-bold text-white mb-5 flex items-center">
        <BarChart2 className="mr-2.5 text-emerald-400" size={22} />
        Performance Metrics
      </h2>

      <div className="space-y-5">
        <div>
          <MetricsProgressBar
            value={speakingSpeed}
            maxValue={250}
            label="Speaking Speed"
            valueLabel={`${speakingSpeed} WPM`}
            colorClass={getSpeedColor()}
          />
          <p className="text-xs text-gray-400 mt-1">{getSpeedStatus()}</p>
        </div>

        <div>
          <MetricsProgressBar
            value={fillerPercentage}
            label="Filler Words"
            valueLabel={`${fillerPercentage}%`}
            colorClass={getFillerColor()}
          />
          <p className="text-xs text-gray-400 mt-1">{getFillerStatus()}</p>
        </div>

        <div>
          <MetricsProgressBar
            value={confidenceScore}
            label="Confidence Score"
            valueLabel={`${confidenceScore}%`}
            colorClass={getConfidenceColor()}
          />
          <p className="text-xs text-gray-400 mt-1">{getConfidenceStatus()}</p>
        </div>
      </div>

      {feedback && (
        <div
          className="mt-7 p-4 bg-emerald-900/15 border-l-2 border-emerald-500 rounded-r-md"
        >
          <h3 className="text-base font-semibold text-emerald-300 mb-2 flex items-center">
            <Lightbulb className="mr-2" size={18} />
            Coaching Feedback
          </h3>
          <p className="text-gray-200 whitespace-pre-line text-sm leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;