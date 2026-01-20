import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import ScoreBadge from '../scoring/ScoreBadge';
import type { Session } from '../../types';

interface PerformanceAnalyticsProps {
  sessions: Session[];
  dateRange?: { start: Date; end: Date };
  filters?: {
    ieltsRange?: [number, number];
    toeflRange?: [number, number];
    topics?: string[];
  };
}

interface AnalyticsData {
  timeSeries: Array<{ date: string; ieltsScore: number; toeflScore: number; speed: number; fillers: number }>;
  skillProgression: Array<{ date: string; fluencyCoherence: number; lexicalResource: number; grammaticalRange: number; pronunciation: number }>;
  performanceDistribution: Array<{ range: string; count: unknown; color: string }>;
  weeklyStats: Array<{ week: string; sessions: number; avgScore: number | null; improvement: number }>;
  correlationData: Array<{ speed: number; score: number; fillers: number; confidence: number }>;
}

const PerformanceAnalytics = ({ sessions, dateRange, filters }: PerformanceAnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeChart, setActiveChart] = useState<'timeline' | 'skills' | 'distribution' | 'correlations'>('timeline');

  useEffect(() => {
    if (sessions.length === 0) return;

    // Filter sessions based on criteria
    let filteredSessions = sessions.filter(s => s.bandScores && s.toeflScores);
    
    if (dateRange) {
      filteredSessions = filteredSessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= dateRange.start && sessionDate <= dateRange.end;
      });
    }

    if (filters?.ieltsRange) {
      filteredSessions = filteredSessions.filter(s => 
        s.bandScores!.overall >= filters.ieltsRange![0] && 
        s.bandScores!.overall <= filters.ieltsRange![1]
      );
    }

    if (filters?.toeflRange) {
      filteredSessions = filteredSessions.filter(s => {
        const avgToefl = (s.toeflScores!.delivery + s.toeflScores!.languageUse + s.toeflScores!.topicDevelopment) / 3;
        return avgToefl >= filters.toeflRange![0] && avgToefl <= filters.toeflRange![1];
      });
    }

    if (filters?.topics && filters.topics.length > 0) {
      filteredSessions = filteredSessions.filter(s => 
        s.topic && filters.topics!.some(topic => s.topic!.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    // Time series data
    const timeSeries = filteredSessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(s => ({
        date: new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        ieltsScore: s.bandScores!.overall,
        toeflScore: (s.toeflScores!.delivery + s.toeflScores!.languageUse + s.toeflScores!.topicDevelopment) / 3,
        speed: s.speed || 0,
        fillers: s.fillerPercentage || 0
      }));

    // Skill progression data
    const skillProgression = filteredSessions.map(s => ({
      date: new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      fluencyCoherence: s.bandScores!.fluencyCoherence,
      lexicalResource: s.bandScores!.lexicalResource,
      grammaticalRange: s.bandScores!.grammaticalRange,
      pronunciation: s.bandScores!.pronunciation
    }));

    // Performance distribution
    const distribution = filteredSessions.reduce((acc, s) => {
      const score = s.bandScores!.overall;
      if (score >= 8.5) acc['9.0+']++;
      else if (score >= 7.5) acc['8.0-8.5']++;
      else if (score >= 6.5) acc['7.0-7.5']++;
      else if (score >= 5.5) acc['6.0-6.5']++;
      else if (score >= 4.5) acc['5.0-5.5']++;
      else acc['<5.0']++;
      return acc;
    }, { '9.0+': 0, '8.0-8.5': 0, '7.0-7.5': 0, '6.0-6.5': 0, '5.0-5.5': 0, '<5.0': 0 });

    const performanceDistribution = Object.entries(distribution).map(([range, count]) => ({
      range,
      count,
      color: range === '9.0+' ? '#10b981' : 
             range === '8.0-8.5' ? '#34d399' : 
             range === '7.0-7.5' ? '#fbbf24' : 
             range === '6.0-6.5' ? '#fb923c' : 
             range === '5.0-5.5' ? '#f87171' : '#ef4444'
    }));

    // Weekly stats (last 8 weeks)
    const weeklyData = new Array(8).fill(0).map((_, index) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (7 - index) * 7);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekSessions = filteredSessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const avgScore = weekSessions.length > 0 
        ? weekSessions.reduce((sum, s) => sum + s.bandScores!.overall, 0) / weekSessions.length 
        : 0;

      const previousWeekAvg = index > 0 
        ? filteredSessions.filter(s => {
            const sessionDate = new Date(s.date);
            const prevWeekStart = new Date(weekStart);
            prevWeekStart.setDate(prevWeekStart.getDate() - 7);
            const prevWeekEnd = new Date(weekStart);
            prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
            return sessionDate >= prevWeekStart && sessionDate <= prevWeekEnd;
          }).reduce((sum, s) => sum + s.bandScores!.overall, 0) / 
          filteredSessions.filter(s => {
            const sessionDate = new Date(s.date);
            const prevWeekStart = new Date(weekStart);
            prevWeekStart.setDate(prevWeekStart.getDate() - 7);
            const prevWeekEnd = new Date(weekStart);
            prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
            return sessionDate >= prevWeekStart && sessionDate <= prevWeekEnd;
          }).length || 0
        : 0;

      return {
        week: `W${8 - index}`,
        sessions: weekSessions.length,
        avgScore: avgScore > 0 ? avgScore : null,
        improvement: avgScore > 0 && previousWeekAvg > 0 ? ((avgScore - previousWeekAvg) / previousWeekAvg) * 100 : 0
      };
    });

    // Correlation data
    const correlationData = filteredSessions.map(s => ({
      speed: s.speed || 0,
      score: s.bandScores!.overall,
      fillers: s.fillerPercentage || 0,
      confidence: s.confidence || 0
    }));

    setAnalyticsData({
      timeSeries,
      skillProgression,
      performanceDistribution,
      weeklyStats: weeklyData,
      correlationData
    });

  }, [sessions, dateRange, filters]);

  if (!analyticsData || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <BarChart3 size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No analytics data available</p>
        <p className="text-sm">Complete sessions with IELTS/TOEFL scores to see analytics</p>
      </div>
    );
  }

  const chartTabs = [
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'skills', label: 'Skills', icon: TrendingUp },
    { id: 'distribution', label: 'Distribution', icon: PieChart },
    { id: 'correlations', label: 'Correlations', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 w-fit">
        {chartTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeChart === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart Content */}
      <div
        className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
      >
        {/* Timeline Chart */}
        {activeChart === 'timeline' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Performance Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis yAxisId="left" domain={[4, 9]} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ieltsScore" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="IELTS Band"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="toeflScore" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  name="TOEFL Score"
                  dot={{ fill: '#a855f7', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Skills Progression Chart */}
        {activeChart === 'skills' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Skills Progression</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analyticsData.skillProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis domain={[0, 9]} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="fluencyCoherence" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Fluency & Coherence"
                />
                <Area 
                  type="monotone" 
                  dataKey="lexicalResource" 
                  stackId="2" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Lexical Resource"
                />
                <Area 
                  type="monotone" 
                  dataKey="grammaticalRange" 
                  stackId="3" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                  name="Grammatical Range"
                />
                <Area 
                  type="monotone" 
                  dataKey="pronunciation" 
                  stackId="4" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Pronunciation"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Score Distribution Chart */}
        {activeChart === 'distribution' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Correlations Chart */}
        {activeChart === 'correlations' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Performance Correlations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-2">Speed vs Score</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="speed" name="Speed (WPM)" stroke="#9ca3af" />
                    <YAxis dataKey="score" name="IELTS Score" domain={[4, 9]} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                    />
                    <Scatter data={analyticsData.correlationData} fill="#10b981" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Fillers vs Score</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="fillers" name="Filler %" stroke="#9ca3af" />
                    <YAxis dataKey="score" name="IELTS Score" domain={[4, 9]} stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #065f46' }}
                    />
                    <Scatter data={analyticsData.correlationData} fill="#ef4444" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Stats Summary */}
      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {analyticsData.weeklyStats.slice().reverse().map((week) => (
            <div key={week.week} className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">{week.week}</div>
              <div className="text-lg font-bold text-white">{week.sessions}</div>
              <div className="text-xs text-gray-400">sessions</div>
              {week.avgScore && (
                <div className="mt-1">
                  <ScoreBadge score={week.avgScore} type="ielts" size="sm" />
                </div>
              )}
              {week.improvement !== 0 && (
                <div className={`text-xs mt-1 ${week.improvement > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {week.improvement > 0 ? '+' : ''}{week.improvement.toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;