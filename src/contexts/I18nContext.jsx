import { createContext, useContext, useEffect } from "react";
import { useSettings } from "../hooks/useSettings.js";
import { translations } from "../utils/translations.js";
import PropTypes from "prop-types";

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const { settings, updateLanguage } = useSettings();

  useEffect(() => {
    const detectLanguage = () => {
      // Vérifier si c'est la première fois (aucun paramètre stocké)
      const stored = localStorage.getItem("fipbal-settings");
      if (!stored) {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith("br") ? "br" : "fr";
        updateLanguage(detectedLang);
      }
    };

    detectLanguage();
  }, [updateLanguage]);

  const t = (key) => {
    return (
      translations[settings.language]?.[key] || translations.fr[key] || key
    );
  };

  const value = {
    language: settings.language,
    t,
    changeLanguage: updateLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
