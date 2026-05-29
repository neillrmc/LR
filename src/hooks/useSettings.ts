import { useState, useMemo, useCallback } from 'react';
import { AppSettings, QAGuideline } from '../types';
import { storage, getSettings, saveSettings } from '../utils/helpers';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const addGuideline = useCallback((guideline: Omit<QAGuideline, 'id' | 'uploadedAt'>) => {
    setSettings(prev => {
      const newGuideline: QAGuideline = {
        ...guideline,
        id: `guideline-${Date.now()}`,
        uploadedAt: new Date(),
      };
      const updated = {
        ...prev,
        guidelines: [...prev.guidelines, newGuideline],
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const removeGuideline = useCallback((id: string) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        guidelines: prev.guidelines.filter(g => g.id !== id),
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const activeGuidelines = useMemo(() => 
    settings.guidelines.filter(g => g.isActive), 
    [settings.guidelines]
  );

  return { 
    settings, 
    updateSettings, 
    addGuideline, 
    removeGuideline, 
    activeGuidelines 
  };
};