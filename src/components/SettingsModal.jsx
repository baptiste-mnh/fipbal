import PropTypes from "prop-types";
import { useI18n } from "../contexts/I18nContext.jsx";
import { useEffect, useRef } from "react";
import { Github } from "lucide-react";

const SettingsDropdown = ({
  isOpen,
  onClose,
  settings,
  onUpdateLanguage,
  onUpdateWeatherProvider,
}) => {
  const { t } = useI18n();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {t("settings")}
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("language")}
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onUpdateLanguage("fr")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  settings.language === "fr"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    settings.language === "fr" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                {t("french")}
              </button>
              <button
                onClick={() => onUpdateLanguage("br")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  settings.language === "br"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    settings.language === "br" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                {t("breton")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("weatherProvider")}
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onUpdateWeatherProvider("openmeteo")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  settings.weatherProvider === "openmeteo"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    settings.weatherProvider === "openmeteo"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                Open-Meteo
              </button>
              <button
                onClick={() => onUpdateWeatherProvider("wttr")}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  settings.weatherProvider === "wttr"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    settings.weatherProvider === "wttr"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                wttr.in
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-6">
          <a
            href="https://github.com/baptiste-mnh/fipbal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Github size={18} className="mr-2" />
            <span className="text-sm">Source sur GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

SettingsDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    language: PropTypes.string.isRequired,
    weatherProvider: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateLanguage: PropTypes.func.isRequired,
  onUpdateWeatherProvider: PropTypes.func.isRequired,
};

export default SettingsDropdown;
