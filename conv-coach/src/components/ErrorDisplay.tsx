
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div
      className="mb-6 bg-red-900/20 border border-red-500/30 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-400 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-red-300 font-medium mb-1">Error</h3>
          <p className="text-red-100 text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;