
import { X, Settings } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import FillerWordsManager from './FillerWordsManager';

interface SettingsModalProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  selectedLanguage: string;
  customFillers: string[];
  newFillerWord: string;
  setNewFillerWord: (word: string) => void;
  onLanguageChange: (language: string) => void;
  onAddFiller: () => void;
  onRemoveFiller: (index: number) => void;
  onResetFillers: () => void;
  currentLanguageName: string;
}

const SettingsModal = ({
  showSettings,
  setShowSettings,
  selectedLanguage,
  customFillers,
  newFillerWord,
  setNewFillerWord,
  onLanguageChange,
  onAddFiller,
  onRemoveFiller,
  onResetFillers,
  currentLanguageName
}: SettingsModalProps) => {
  if (!showSettings) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md border border-emerald-500/20 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-emerald-900/30">
          <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <Settings className="mr-3 text-emerald-400" size={24} />
            Settings
          </h2>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 #1f2937' }}>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />

          <FillerWordsManager
            customFillers={customFillers}
            newFillerWord={newFillerWord}
            setNewFillerWord={setNewFillerWord}
            onAddFiller={onAddFiller}
            onRemoveFiller={onRemoveFiller}
            onResetToDefaults={onResetFillers}
            currentLanguageName={currentLanguageName}
          />
        </div>

        <div className="p-4 bg-black/20 border-t border-emerald-900/30 text-center">
          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;