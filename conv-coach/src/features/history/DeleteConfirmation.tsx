
import { X, Trash2 } from 'lucide-react';

interface DeleteConfirmationProps {
  showConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}

const DeleteConfirmation = ({
  showConfirm,
  setShowConfirm,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmColor = "rose"
}: DeleteConfirmationProps) => {
  if (!showConfirm) return null;

  const confirmButtonClass = confirmColor === 'amber'
    ? 'bg-amber-600 hover:bg-amber-700'
    : 'bg-rose-600 hover:bg-rose-700';

  const iconBgClass = confirmColor === 'amber'
    ? 'bg-amber-500/15'
    : 'bg-rose-500/15';

  const iconClass = confirmColor === 'amber'
    ? 'text-amber-400'
    : 'text-rose-400';



  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border shadow-2xl"
        style={{ borderColor: confirmColor === 'amber' ? '#f59e0b' : '#ef4444' }}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center mb-4`}>
            {confirmColor === 'amber' ? (
              <Trash2 size={24} className={iconClass} />
            ) : (
              <X size={24} className={iconClass} />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2.5 ${confirmButtonClass} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;