import { useState, useEffect } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Award, Target, Clock, Calendar, BarChart3 } from 'lucide-react';
import ScoreBadge from '../scoring/ScoreBadge';
import type { Session } from '../../types';

interface HistoryDashboardProps {
  sessions: Session[];
}

interface HistoryStats {
  totalSessions: number;
  averageIELTS: number;
  averageTOEFL: number;
  improvementRate: number;
  strongestSkill: string;
  weakestSkill: string;
  topTopics: string[];
  totalDuration: number;
  recentPerformance: Array<{date: string, score: number, type: string}>;
}

const HistoryDashboard = ({ sessions }: HistoryDashboardProps) => {
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);
  const [skillRadarData, setSkillRadarData] = useState<any[]>([]);

  useEffect(() => {
    if (sessions.length === 0) return;

    // Calculate statistics
    const sessionsWithScores = sessions.filter(s => s.bandScores && s.toeflScores);
    
    if (sessionsWithScores.length === 0) return;

    // Calculate averages
    const avgIELTS = sessionsWithScores.reduce((sum, s) => sum + (s.bandScores?.overall || 0), 0) / sessionsWithScores.length;
    const avgTOEFL = sessionsWithScores.reduce((sum, s) => {
      const toeflTotal = (s.toeflScores?.delivery || 0) + (s.toeflScores?.languageUse || 0) + (s.toeflScores?.topicDevelopment || 0);
      return sum + (toeflTotal / 3);
    }, 0) / sessionsWithScores.length;

    // Calculate improvement rate (last 5 sessions vs first 5)
    let improvementRate = 0;
    if (sessionsWithScores.length >= 2) {
      const recentSessions = sessionsWithScores.slice(-5);
      const olderSessions = sessionsWithScores.slice(0, 5);
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.bandScores?.overall || 0), 0) / recentSessions.length;
      const olderAvg = olderSessions.reduce((sum, s) => sum + (s.bandScores?.overall || 0), 0) / olderSessions.length;
      improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;
    }

    // Calculate skill averages
    const skillAverages = {
      fluencyCoherence: sessionsWithScores.reduce((sum, s) => sum + (s.bandScores?.fluencyCoherence || 0), 0) / sessionsWithScores.length,
      lexicalResource: sessionsWithScores.reduce((sum, s) => sum + (s.bandScores?.lexicalResource || 0), 0) / sessionsWithScores.length,
      grammaticalRange: sessionsWithScores.reduce((sum, s) => sum + (s.bandScores?.grammaticalRange || 0), 0) / sessionsWithScores.length,
      pronunciation: sessionsWithScores.reduce((sum, s) => sum + (s.bandScores?.pronunciation || 0), 0) / sessionsWithScores.length,
    };

    const skills = Object.entries(skillAverages);
    const strongestSkill = skills.reduce((max, [skill, score]) => score > max[1] ? [skill, score] : max, ['', 0])[0];
    const weakestSkill = skills.reduce((min, [skill, score]) => score < min[1] ? [skill, score] : min, ['', 10])[0];

    // Get top topics
    const topicCounts = sessions.filter(s => s.topic).reduce((acc, s) => {
      acc[s.topic!] = (acc[s.topic!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic);

    // Total duration
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Recent performance data for line chart
    const recentPerformance = sessions.slice(-10).reverse().map(s => ({
      date: new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      score: s.bandScores?.overall || 0,
      type: 'IELTS'
    }));

    // Score distribution for pie chart
    const distribution = sessionsWithScores.reduce((acc, s) => {
      const score = s.bandScores?.overall || 0;
      if (score >= 8) acc.expert++;
      else if (score >= 7) acc.good++;
      else if (score >= 6) acc.competent++;
      else if (score >= 5) acc.modest++;
      else acc.limited++;
      return acc;
    }, { expert: 0, good: 0, competent: 0, modest: 0, limited: 0 });

    const scoreDistributionData = Object.entries(distribution).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: level === 'expert' ? '#10b981' : 
             level === 'good' ? '#34d399' : 
             level === 'competent' ? '#fbbf24' : 
             level === 'modest' ? '#fb923c' : '#ef4444'
    }));

    // Radar chart data
    const radarData = Object.entries(skillAverages).map(([skill, score]) => ({
      skill: skill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      score: score * 1.11 // Convert to 10-point scale for better visualization
    }));

    setStats({
      totalSessions: sessions.length,
      averageIELTS: avgIELTS,
      averageTOEFL: avgTOEFL,
      improvementRate,
      strongestSkill: strongestSkill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      weakestSkill: weakestSkill.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      topTopics,
      totalDuration,
      recentPerformance
    });

    setScoreDistribution(scoreDistributionData);
    setSkillRadarData(radarData);

  }, [sessions]);

  if (!stats || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <BarChart3 size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No session data available</p>
        <p className="text-sm">Complete some sessions to see your performance dashboard</p>
      </div>
    );
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-emerald-400" size={20} />
            <span className="text-2xl font-bold text-white">{stats.totalSessions}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Sessions</p>
        </div>

        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="text-emerald-400" size={20} />
            <ScoreBadge score={stats.averageIELTS} type="ielts" size="md" />
          </div>
          <p className="text-gray-400 text-sm">Average IELTS Band</p>
        </div>

        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="text-emerald-400" size={20} />
            <ScoreBadge score={stats.averageTOEFL} type="toefl" size="md" />
          </div>
          <p className="text-gray-400 text-sm">Average TOEFL Score</p>
        </div>

        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-emerald-400" size={20} />
            <span className="text-2xl font-bold text-white">{formatDuration(stats.totalDuration)}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Practice Time</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance Chart */}
        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} />
            Recent Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.recentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis domain={[4, 9]} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution */}
        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={scoreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar Chart */}
        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Skills Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillRadarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9ca3af" />
              <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Insights */}
        <div
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-emerald-400 font-medium">Strongest Skill</span>
                <span className="text-white font-bold">{stats.strongestSkill}</span>
              </div>
              <div className="text-sm text-gray-400">Keep leveraging this strength</div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-orange-400 font-medium">Focus Area</span>
                <span className="text-white font-bold">{stats.weakestSkill}</span>
              </div>
              <div className="text-sm text-gray-400">Consider extra practice here</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-400 font-medium">Improvement Rate</span>
                <span className={`font-bold flex items-center gap-1 ${stats.improvementRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.improvementRate >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(stats.improvementRate).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-400">Recent vs older sessions</div>
            </div>

            {stats.topTopics.length > 0 && (
              <div>
                <div className="text-blue-400 font-medium mb-1">Most Discussed Topics</div>
                <div className="flex flex-wrap gap-2">
                  {stats.topTopics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDashboard;