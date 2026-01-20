import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../../../constants';
import type { SettingsState } from '../../../types';

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    selectedLanguage: 'en-US',
    customFillers: []
  });
  const [showSettings, setShowSettings] = useState(false);
  const [newFillerWord, setNewFillerWord] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        const data = await response.json();
        setSettings({
          selectedLanguage: data.selectedLanguage,
          customFillers: data.customFillers
        });
      } catch (err) {
        console.error("Failed to load settings from DB:", err);
      }
    };
    fetchSettings();
  }, []);

  const saveSettingsToDB = async (lang: string, fillers: string[]) => {
    try {
      await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedLanguage: lang, customFillers: fillers })
      });
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    const defaultFillers = SUPPORTED_LANGUAGES.find((l: any) => l.code === newLang)?.defaultFillers || [];
    const newSettings = { selectedLanguage: newLang, customFillers: defaultFillers };
    setSettings(newSettings);
    saveSettingsToDB(newLang, defaultFillers);
  };

  const handleAddFiller = () => {
    if (newFillerWord) {
      const updatedFillers = [...settings.customFillers, newFillerWord];
      const newSettings = { ...settings, customFillers: updatedFillers };
      setSettings(newSettings);
      setNewFillerWord('');
      saveSettingsToDB(settings.selectedLanguage, updatedFillers);
    }
  };

  const handleRemoveFiller = (index: number) => {
    const updatedFillers = settings.customFillers.filter((_, i) => i !== index);
    const newSettings = { ...settings, customFillers: updatedFillers };
    setSettings(newSettings);
    saveSettingsToDB(settings.selectedLanguage, updatedFillers);
  };

  const resetFillersToDefaults = () => {
    const defaultLanguage = SUPPORTED_LANGUAGES.find((l: any) => l.code === settings.selectedLanguage) || SUPPORTED_LANGUAGES[0];
    const newSettings = { ...settings, customFillers: defaultLanguage.defaultFillers };
    setSettings(newSettings);
    saveSettingsToDB(settings.selectedLanguage, defaultLanguage.defaultFillers);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find((lang: any) => lang.code === settings.selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return {
    settings,
    showSettings,
    setShowSettings,
    newFillerWord,
    setNewFillerWord,
    handleLanguageChange,
    handleAddFiller,
    handleRemoveFiller,
    resetFillersToDefaults,
    currentLanguage
  };
};