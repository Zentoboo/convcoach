import { motion } from 'framer-motion';

interface MetricsProgressBarProps {
  value: number;
  maxValue?: number;
  label: string;
  valueLabel?: string;
  colorClass: string;
  bgClass?: string;
}

const MetricsProgressBar = ({
  value,
  maxValue = 100,
  label,
  valueLabel,
  colorClass,
  bgClass = "bg-gray-900"
}: MetricsProgressBarProps) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-300 text-sm font-medium">{label}</span>
        <span className="text-white font-bold">{valueLabel || value}</span>
      </div>
      <div className={`w-full ${bgClass} rounded-lg h-2.5 overflow-hidden border border-gray-800`}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          className={`h-full rounded-lg ${colorClass}`}
        />
      </div>
    </div>
  );
};

export default MetricsProgressBar;