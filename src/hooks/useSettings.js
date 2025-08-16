import { useState, useEffect } from "react";

const SETTINGS_KEY = "fipbal-settings";

const DEFAULT_SETTINGS = {
  language: "fr", // "fr" ou "br"
  weatherProvider: "openmeteo", // "wttr" ou "openmeteo"
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(
      new CustomEvent("settingsChanged", { detail: settings })
    );
  } catch (error) {
    console.warn("Erreur lors de la sauvegarde des paramètres:", error);
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(getStoredSettings);

  // Écouter les changements de settings depuis d'autres composants
  useEffect(() => {
    const handleSettingsChange = (event) => {
      setSettings(event.detail);
    };

    window.addEventListener("settingsChanged", handleSettingsChange);
    return () =>
      window.removeEventListener("settingsChanged", handleSettingsChange);
  }, []);

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const updateLanguage = (language) => {
    updateSettings({ language });
  };

  const updateWeatherProvider = (weatherProvider) => {
    updateSettings({ weatherProvider });
  };

  return {
    settings,
    updateSettings,
    updateLanguage,
    updateWeatherProvider,
  };
};
