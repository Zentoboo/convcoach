import React from 'react';
import { useSettings } from '../features/settings/hooks/useSettings';

const SettingsPage: React.FC = () => {
  const {
    settings,
    newFillerWord,
    setNewFillerWord,
    handleLanguageChange,
    handleAddFiller,
    handleRemoveFiller,
    resetFillersToDefaults,
    currentLanguage
  } = useSettings();

  const handleAddFillerWord = () => {
    if (newFillerWord.trim()) {
      handleAddFiller();
      setNewFillerWord('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFillerWord();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Settings
        </h1>
        <p 
          className="text-lg"
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-secondary)'
          }}
        >
          Configure your preferences and customize your learning experience
        </p>
      </div>

      {/* Language Settings */}
      <div 
        className="surface rounded-xl p-6 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-surface-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h2 
          className="text-xl font-semibold mb-4"
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Language Settings
        </h2>
        
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-text-secondary)'
            }}
          >
            Selected Language
          </label>
          <select
            value={settings.selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full p-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderColor: 'var(--color-surface-border)',
              color: 'var(--color-text-primary)',
              padding: 'var(--space-3)'
            }}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="en-AU">English (Australia)</option>
            <option value="en-CA">English (Canada)</option>
          </select>
          
          <p 
            className="text-sm mt-2"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)'
            }}
          >
            Current: {currentLanguage.name}
          </p>
        </div>
      </div>

      {/* Filler Words Settings */}
      <div 
        className="surface rounded-xl p-6 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-surface-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h2 
          className="text-xl font-semibold mb-4"
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Filler Words Detection
        </h2>
        
        {/* Add New Filler Word */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newFillerWord}
            onChange={(e) => setNewFillerWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new filler word..."
            className="flex-1 p-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              borderColor: 'var(--color-surface-border)',
              color: 'var(--color-text-primary)',
              padding: 'var(--space-3)'
            }}
          />
          <button
            onClick={handleAddFillerWord}
            disabled={!newFillerWord.trim()}
            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}
          >
            Add
          </button>
        </div>

        {/* Current Filler Words List */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label 
              className="block text-sm font-medium"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Current Filler Words
            </label>
            <button
              onClick={resetFillersToDefaults}
              className="text-sm hover:text-primary transition-colors duration-200"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-primary)'
              }}
            >
              Reset to Defaults
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.customFillers.map((filler: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: `1px solid var(--color-surface-border)`,
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                {filler}
                <button
                  onClick={() => handleRemoveFiller(0)} // Using index 0 for now
                  className="ml-1 hover:text-error transition-colors duration-200"
                  style={{ color: 'var(--color-error)' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div 
        className="surface rounded-xl p-6 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-surface-border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h2 
          className="text-xl font-semibold mb-4"
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)'
          }}
        >
          Session Settings
        </h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span 
              className="text-sm"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Enable real-time feedback
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span 
              className="text-sm"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Save sessions to history
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span 
              className="text-sm"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Show advanced analytics
            </span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)'
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;