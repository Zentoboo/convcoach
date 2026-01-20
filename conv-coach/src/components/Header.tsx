import { motion } from 'framer-motion';
import { Settings, History } from 'lucide-react';

interface HeaderProps {
  onShowSettings: () => void;
  onShowHistory: () => void;
}

const Header = ({ onShowSettings, onShowHistory }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-emerald-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Communication Coach</h1>
              <p className="text-gray-400 text-sm">Improve your speaking confidence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowHistory}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors border border-emerald-500/30"
            >
              <History size={18} />
              <span className="hidden sm:inline">History</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowSettings}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors border border-emerald-500/30"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;