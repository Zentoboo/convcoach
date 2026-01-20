
import { X, Lightbulb } from 'lucide-react';

interface FillerWordsManagerProps {
  customFillers: string[];
  newFillerWord: string;
  setNewFillerWord: (word: string) => void;
  onAddFiller: () => void;
  onRemoveFiller: (index: number) => void;
  onResetToDefaults: () => void;
  currentLanguageName: string;
}

const FillerWordsManager = ({
  customFillers,
  newFillerWord,
  setNewFillerWord,
  onAddFiller,
  onRemoveFiller,
  onResetToDefaults,
  currentLanguageName
}: FillerWordsManagerProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500/70 flex items-center">
          <Lightbulb className="mr-2" size={16} />
          Filler Word Tracking
        </h3>
        <button
          onClick={onResetToDefaults}
          className="text-[11px] font-medium text-emerald-500/60 hover:text-emerald-400 underline decoration-emerald-500/20 underline-offset-4"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-emerald-900/30">
        <div className="flex flex-wrap gap-2 mb-4">
          {customFillers.map((filler, index) => (
            <span
              key={`filler-${index}-${filler}`}
              className="flex items-center bg-emerald-500/10 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-500/20"
            >
              {filler}
              <button
                onClick={() => onRemoveFiller(index)}
                className="ml-1.5 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type word..."
            value={newFillerWord}
            onChange={(e) => setNewFillerWord(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newFillerWord) {
                onAddFiller();
                setNewFillerWord('');
              }
            }}
            className="flex-1 bg-black/40 border border-emerald-900/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={onAddFiller}
            className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-600/30 border border-emerald-500/20 transition-all"
          >
            ADD
          </button>
        </div>
      </div>

      <p className="text-[11px] text-gray-500">
        Current analysis set for: <span className="text-emerald-500/80 font-medium">{currentLanguageName}</span>
      </p>
    </div>
  );
};

export default FillerWordsManager;