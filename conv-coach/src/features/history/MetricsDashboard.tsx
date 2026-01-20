
import { BarChart2, Lightbulb, Clock, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

interface MetricsDashboardProps {
  session: any;
  previousSession?: any;
}

const MetricsDashboard = ({ session, previousSession }: MetricsDashboardProps) => {
  const getSpeedStatus = (speed: number) => {
    if (speed < 120) return { status: 'Too Slow', color: 'text-blue-400' };
    if (speed < 150) return { status: 'Slightly Slow', color: 'text-blue-300' };
    if (speed > 220) return { status: 'Too Fast', color: 'text-orange-400' };
    if (speed > 190) return { status: 'Slightly Fast', color: 'text-yellow-400' };
    return { status: 'Optimal', color: 'text-emerald-400' };
  };

  const getFillerStatus = (percentage: number) => {
    if (percentage > 15) return { status: 'High', color: 'text-red-400' };
    if (percentage > 8) return { status: 'Moderate', color: 'text-yellow-400' };
    return { status: 'Low', color: 'text-emerald-400' };
  };

  const getDurationStatus = (duration: number) => {
    if (duration < 60) return { status: 'Too Short', color: 'text-blue-400' };
    if (duration > 300) return { status: 'Very Long', color: 'text-orange-400' };
    return { status: 'Good Length', color: 'text-emerald-400' };
  };

  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    
    if (current > previous) return <TrendingUp size={12} className="text-emerald-400" />;
    if (current < previous) return <TrendingDown size={12} className="text-red-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  const getTrendColor = (current: number, previous: number | undefined, metric: string) => {
    if (previous === undefined) return 'text-gray-400';
    
    const diff = current - previous;
    
    // Different metrics have different trend interpretations
    if (metric === 'fillerPercentage') {
      // For fillers, lower is better
      if (diff < -2) return 'text-emerald-400';
      if (diff > 2) return 'text-red-400';
    } else if (metric === 'speed') {
      // For speed, closer to optimal range is better
      const optimalRange = [150, 190];
      const wasOptimal = previous >= optimalRange[0] && previous <= optimalRange[1];
      const isOptimal = current >= optimalRange[0] && current <= optimalRange[1];
      
      if (isOptimal && !wasOptimal) return 'text-emerald-400';
      if (!isOptimal && wasOptimal) return 'text-red-400';
      if (Math.abs(current - previous) < 5) return 'text-gray-400';
    } else {
      // For other metrics, higher is better
      if (diff > 5) return 'text-emerald-400';
      if (diff < -5) return 'text-red-400';
    }
    
    return 'text-gray-400';
  };

  const getPerformanceLevel = (confidence: number) => {
    if (confidence >= 85) return { level: 'Expert', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' };
    if (confidence >= 70) return { level: 'Advanced', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30' };
    if (confidence >= 55) return { level: 'Intermediate', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
    return { level: 'Developing', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
  };

  const speedInfo = getSpeedStatus(session.speed || 0);
  const fillerInfo = getFillerStatus(session.fillerPercentage || 0);
  const durationInfo = getDurationStatus(session.duration || 0);
  const performanceLevel = getPerformanceLevel(session.confidence);

  return (
    <div
      className="bg-gray-900/70 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <BarChart2 size={20} className="mr-2 text-emerald-400" />
        Performance Metrics
      </h2>

      {/* Performance Level Overview */}
      <div className={`${performanceLevel.bgColor} rounded-lg p-4 border ${performanceLevel.borderColor} mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className={performanceLevel.color} />
              <span className="text-sm text-gray-300">Performance Level</span>
            </div>
            <div className={`text-2xl font-bold ${performanceLevel.color}`}>
              {performanceLevel.level}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Based on overall confidence score of {session.confidence}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">{session.confidence}%</div>
            <div className="text-xs text-gray-400">Confidence</div>
            {previousSession && (
              <div className={`flex items-center justify-end gap-1 text-xs ${getTrendColor(session.confidence, previousSession.confidence, 'confidence')}`}>
                {getTrendIcon(session.confidence, previousSession.confidence)}
                {Math.abs(session.confidence - previousSession.confidence).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Speed Metric */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-emerald-400">
              <BarChart2 size={16} className="mr-2" />
              <span className="text-sm font-medium">Speaking Speed</span>
            </div>
            {previousSession && (
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(session.speed || 0, previousSession.speed, 'speed')}`}>
                {getTrendIcon(session.speed || 0, previousSession.speed)}
                {Math.abs((session.speed || 0) - (previousSession.speed || 0))}
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {session.speed || 0}
          </div>
          <div className="text-xs text-gray-400 mb-2">Words Per Minute</div>
          <div className={`text-sm font-medium ${speedInfo.color}`}>
            {speedInfo.status}
          </div>
          <div className="w-full bg-black/30 rounded-full h-1.5 mt-2">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(Math.max((session.speed || 0) / 250 * 100, 0), 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Filler Words Metric */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-emerald-400">
              <Lightbulb size={16} className="mr-2" />
              <span className="text-sm font-medium">Filler Words</span>
            </div>
            {previousSession && (
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(session.fillerPercentage || 0, previousSession.fillerPercentage, 'fillerPercentage')}`}>
                {getTrendIcon(session.fillerPercentage || 0, previousSession.fillerPercentage)}
                {Math.abs((session.fillerPercentage || 0) - (previousSession.fillerPercentage || 0)).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {session.fillerPercentage || 0}%
          </div>
          <div className="text-xs text-gray-400 mb-2">of total words</div>
          <div className={`text-sm font-medium ${fillerInfo.color}`}>
            {fillerInfo.status}
          </div>
          <div className="w-full bg-black/30 rounded-full h-1.5 mt-2">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                (session.fillerPercentage || 0) > 15 ? 'bg-red-500' :
                (session.fillerPercentage || 0) > 8 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((session.fillerPercentage || 0) / 20 * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Duration Metric */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-emerald-900/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-emerald-400">
              <Clock size={16} className="mr-2" />
              <span className="text-sm font-medium">Session Duration</span>
            </div>
            {previousSession && (
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(session.duration || 0, previousSession.duration, 'duration')}`}>
                {getTrendIcon(session.duration || 0, previousSession.duration)}
                {Math.abs((session.duration || 0) - (previousSession.duration || 0))}s
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-400 mb-2">minutes:seconds</div>
          <div className={`text-sm font-medium ${durationInfo.color}`}>
            {durationInfo.status}
          </div>
          <div className="w-full bg-black/30 rounded-full h-1.5 mt-2">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                (session.duration || 0) < 60 ? 'bg-blue-500' :
                (session.duration || 0) > 300 ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((session.duration || 0) / 300 * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-black/30 rounded-lg p-4 border border-emerald-900/20">
        <h3 className="text-white font-medium mb-3 text-sm">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
            <div>
              <div className="text-xs text-gray-300">
                {speedInfo.status === 'Optimal' ? 'Speaking pace is within ideal range for clear communication' :
                 speedInfo.status === 'Too Slow' ? 'Consider practicing to increase speaking pace' :
                 speedInfo.status === 'Too Fast' ? 'Practice slowing down for better clarity' :
                 'Speaking pace is slightly outside optimal range'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
            <div>
              <div className="text-xs text-gray-300">
                {fillerInfo.status === 'Low' ? 'Excellent use of vocabulary with minimal fillers' :
                 fillerInfo.status === 'Moderate' ? 'Good control with some room for improvement' :
                 'High filler usage - practice reducing for clearer speech'}
              </div>
            </div>
          </div>

          {session.topic && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
              <div>
                <div className="text-xs text-gray-300">
                  Focused on: <span className="text-blue-300 font-medium">{session.topic}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5" />
            <div>
              <div className="text-xs text-gray-300">
                Performance trending: <span className={`font-medium ${performanceLevel.color}`}>{performanceLevel.level} level</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!previousSession && (
        <div className="mt-4 p-3 bg-emerald-900/10 rounded-lg border border-emerald-900/20">
          <p className="text-xs text-emerald-300">
            Continue practicing to see performance trends and improvements over time.
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricsDashboard;