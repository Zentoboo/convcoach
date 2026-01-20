import { ChevronDown, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../constants';


interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500/70 flex items-center">
        <Globe className="mr-2" size={16} />
        Voice Language
      </h3>
      <div className="relative group">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full appearance-none bg-black/60 border border-emerald-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer hover:bg-black/80"
        >
          {SUPPORTED_LANGUAGES.map((lang: any) => (
            <option key={lang.code} value={lang.code} className="bg-gray-900">
              {lang.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-6 flex items-center px-2 pointer-events-none group-hover:text-emerald-300 transition-colors">
          <ChevronDown size={18} className="text-emerald-500" />
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500 italic">
        Note: Speech recognition accuracy depends on your browser's local engine and microphone quality.
      </p>
    </div>
  );
};

export default LanguageSelector;