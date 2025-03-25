
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ConfigContextType = {
  settings: {
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    language: string;
    units: string;
    theme: 'light' | 'dark' | 'system';
  };
  updateSettings: (newSettings: Partial<ConfigContextType['settings']>) => void;
};

const defaultSettings = {
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timezone: 'UTC',
  language: 'en',
  units: 'metric',
  theme: 'light' as const,
};

const ConfigContext = createContext<ConfigContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState(defaultSettings);

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(current => ({
      ...current,
      ...newSettings,
    }));
  };

  return (
    <ConfigContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};
