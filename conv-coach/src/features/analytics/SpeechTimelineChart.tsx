import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TimelineData } from '../../types';

interface SpeechTimelineChartProps {
  timelineData: TimelineData[];
  customFillers: string[];
  sessionId: string;
  showAverage?: boolean;
}

const SpeechTimelineChart = ({ timelineData, customFillers, sessionId, showAverage = true }: SpeechTimelineChartProps) => {
  const getAverageWPM = () => {
    if (timelineData.length === 0) return 0;
    return Math.round(timelineData.reduce((sum, point) => sum + point.wpm, 0) / timelineData.length);
  };

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-emerald-900/20">
      <div className="h-48 w-full" style={{ minHeight: '150px', minWidth: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData && timelineData.length > 0
              ? timelineData
              : [{ time: 0, wpm: 0, word: '', isFiller: false }]}
            margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
              label={{
                value: 'Time (s)',
                position: 'insideBottom',
                offset: 0,
                fill: '#9ca3af',
                fontSize: 10
              }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
              label={{
                value: 'WPM',
                angle: -90,
                position: 'insideLeft',
                fill: '#9ca3af',
                fontSize: 10
              }}
              domain={[0, 'dataMax + 20']}
            />
            {showAverage && timelineData && timelineData.length > 0 && (
              <ReferenceLine
                y={getAverageWPM()}
                stroke="#9ca3af"
                strokeDasharray="3 3"
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #065f46',
                borderRadius: '8px',
                padding: '6px',
                fontSize: '11px'
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
                      key={`hist-filler-${sessionId}-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth={1.5}
                    />
                  );
                }
                return (
                  <circle
                    key={`hist-normal-${sessionId}-${index}`}
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill="#10b981"
                  />
                );
              }}
              activeDot={{ r: 5, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-emerald-500"></div>
          <span className="text-gray-400">Speed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600"></div>
          <span className="text-gray-400">Filler</span>
        </div>
        {showAverage && timelineData?.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 border-dashed border-t-2 border-gray-400"></div>
            <span className="text-gray-400">
              Avg: {getAverageWPM()} WPM
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechTimelineChart;