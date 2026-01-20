import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TimelineData } from '../../types';

interface SpeechTimelineProps {
  timelineData: TimelineData[];
  customFillers: string[];
}

const SpeechTimeline = ({ timelineData, customFillers }: SpeechTimelineProps) => {
  const getAverageWPM = () => {
    if (timelineData.length === 0) return 0;
    return Math.round(timelineData.reduce((sum, point) => sum + point.wpm, 0) / timelineData.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6 bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <BarChart2 className="mr-2.5 text-emerald-400" size={22} />
          Speech Timeline Analysis
        </h2>
        <span className="text-xs text-gray-500">
          {timelineData.length} data point{timelineData.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        className="bg-black/30 p-6 rounded-xl border border-emerald-900/20"
        style={{ minHeight: '300px', minWidth: '300px' }}
      >
        {timelineData.length > 0 ? (
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{
                    value: 'Time (seconds)',
                    position: 'insideBottom',
                    offset: -5,
                    fill: '#9ca3af'
                  }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{
                    value: 'Words Per Minute',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#9ca3af'
                  }}
                  domain={[0, 'dataMax + 20']}
                />
                <ReferenceLine
                  y={getAverageWPM()}
                  stroke="#9ca3af"
                  strokeDasharray="3 3"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #065f46',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  itemStyle={{ color: '#10b981' }}
                  labelStyle={{ color: '#d1d5db' }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'wpm') {
                      const word = props.payload.word;
                      const isFiller = props.payload.isFiller;
                      let category = '';
                      if (value < 120) category = ' (Too Slow)';
                      else if (value < 150) category = ' (Slightly Slow)';
                      else if (value > 220) category = ' (Too Fast)';
                      else if (value > 190) category = ' (Slightly Fast)';
                      else category = ' (Optimal)';
                      return [
                        `${value} WPM${category}${word ? ` - "${word}"` : ''}${isFiller ? ' (FILLER)' : ''}`,
                        'Speed'
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload, index } = props;
                    if (!payload) return null;

                    const cleanWord = String(payload.word || '').toLowerCase().replace(/[.,?!]/g, '');
                    const isFiller = customFillers.some(f =>
                      cleanWord === f.toLowerCase().trim()
                    );

                    if (isFiller) {
                      return (
                        <circle
                          key={`filler-${index}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill="#ef4444"
                          stroke="#dc2626"
                          strokeWidth={2}
                        />
                      );
                    }
                    return (
                      <circle
                        key={`normal-${index}`}
                        cx={cx}
                        cy={cy}
                        r={2}
                        fill="#10b981"
                      />
                    );
                  }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
            <BarChart2 size={48} className="text-emerald-500/30 mb-4" />
            <p className="text-lg font-medium mb-1">No speech data available yet</p>
            <p className="text-sm">Start a recording session to see your speaking timeline</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-emerald-500"></div>
            <span className="text-gray-400">Speaking Speed (WPM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-600"></div>
            <span className="text-gray-400">Filler Word Detected</span>
          </div>
          {timelineData.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-dashed border-t-2 border-gray-400"></div>
              <span className="text-gray-400">
                Average: {getAverageWPM()} WPM
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SpeechTimeline;