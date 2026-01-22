import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface NavigationContextType {
  // Confirmation dialog states only
  showDeleteConfirm: boolean;
  showClearConfirm: boolean;
  
  // Confirmation dialog setters
  setShowDeleteConfirm: (show: boolean) => void;
  setShowClearConfirm: (show: boolean) => void;
  
  // Navigation helpers
  closeDeleteConfirm: () => void;
  closeClearConfirm: () => void;
  
  // Close all confirmation dialogs
  closeAllConfirmations: () => void;
  
  // Current mode (for styling purposes)
  currentMode: 'home' | 'basic' | 'ielts' | 'settings' | 'history';
  setCurrentMode: (mode: 'home' | 'basic' | 'ielts' | 'settings' | 'history') => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentMode, setCurrentMode] = useState<'home' | 'basic' | 'ielts' | 'settings' | 'history'>('home');

  // Confirmation dialog setters with cleanup
  const handleSetShowDeleteConfirm = (show: boolean) => {
    setShowDeleteConfirm(show);
    if (show) {
      // Close other confirmation dialogs when opening delete confirmation
      setShowClearConfirm(false);
    }
  };

  const handleSetShowClearConfirm = (show: boolean) => {
    setShowClearConfirm(show);
    if (show) {
      // Close other confirmation dialogs when opening clear confirmation
      setShowDeleteConfirm(false);
    }
  };

  // Navigation helpers
  const closeDeleteConfirm = () => handleSetShowDeleteConfirm(false);
  const closeClearConfirm = () => handleSetShowClearConfirm(false);
  const closeAllConfirmations = () => {
    setShowDeleteConfirm(false);
    setShowClearConfirm(false);
  };

  const value: NavigationContextType = {
    // Confirmation dialog states
    showDeleteConfirm,
    showClearConfirm,
    
    // Confirmation dialog setters
    setShowDeleteConfirm: handleSetShowDeleteConfirm,
    setShowClearConfirm: handleSetShowClearConfirm,
    
    // Navigation helpers
    closeDeleteConfirm,
    closeClearConfirm,
    
    // Close all confirmation dialogs
    closeAllConfirmations,
    
    // Current mode
    currentMode,
    setCurrentMode,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};