'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressState {
  hasStarted: boolean;
  cakeCompleted: boolean;
  giftUnlocked: boolean;
}

interface ProgressContextType {
  progress: ProgressState;
  setHasStarted: (value: boolean) => void;
  setCakeCompleted: (value: boolean) => void;
  setGiftUnlocked: (value: boolean) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'birthday-progress';

const defaultProgress: ProgressState = {
  hasStarted: false,
  cakeCompleted: false,
  giftUnlocked: false,
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
      } catch (error) {
        console.error('Failed to parse progress from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const setHasStarted = (value: boolean) => {
    setProgress((prev) => ({ ...prev, hasStarted: value }));
  };

  const setCakeCompleted = (value: boolean) => {
    setProgress((prev) => ({ ...prev, cakeCompleted: value }));
  };

  const setGiftUnlocked = (value: boolean) => {
    setProgress((prev) => ({ ...prev, giftUnlocked: value }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setHasStarted,
        setCakeCompleted,
        setGiftUnlocked,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
