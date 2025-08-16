import { Settings } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useI18n } from "../contexts/I18nContext.jsx";
import { useSettings } from "../hooks/useSettings.js";
import SettingsDropdown from "./SettingsModal.jsx";
import WeatherModal from "./WeatherModal.jsx";

const WeatherDisplay = ({
  comparison,
  lorientData,
  brestData,
  onRetry,
  onRefresh,
  lastFetchTime,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { settings, updateWeatherProvider } = useSettings();
  const { t, changeLanguage } = useI18n();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  if (comparison === null || comparison === undefined) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          <div className="fixed top-4 right-4 z-10">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
              >
                <Settings size={20} />
              </button>

              <SettingsDropdown
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                onUpdateLanguage={changeLanguage}
                onUpdateWeatherProvider={updateWeatherProvider}
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 uppercase mb-8">
              {t("title")}
            </h1>
            <div className="text-6xl md:text-9xl font-black text-red-600 uppercase mb-4">
              {t("error")}
            </div>
            <p className="text-lg text-gray-600 mb-8">{t("errorSubtext")}</p>
            <button
              onClick={onRetry}
              className="bg-gray-800 text-white font-bold uppercase py-3 px-8 rounded hover:bg-gray-700 transition-colors"
            >
              {t("retry")}
            </button>
          </div>

          <div className="fixed bottom-4 text-center text-gray-400 text-sm">
            {t("madeWith")} 🌞 {t("by")}{" "}
            <a
              href="https://github.com/baptiste-mnh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors underline"
            >
              baptiste-mnh
            </a>
          </div>
        </div>
      </>
    );
  }

  const resultColor = comparison ? "text-red-600" : "text-green-600";

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="fixed top-4 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
            >
              <Settings size={20} />
            </button>

            <SettingsDropdown
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              settings={settings}
              onUpdateLanguage={changeLanguage}
              onUpdateWeatherProvider={updateWeatherProvider}
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 uppercase mb-8">
            {t("title")}
          </h1>

          <div
            className={`text-6xl md:text-9xl font-black ${resultColor} uppercase mb-8`}
          >
            {comparison ? t("yes") : t("no")}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-800 text-white font-bold uppercase py-3 px-8 rounded hover:bg-gray-700 transition-colors"
          >
            {t("proof")} {comparison ? "😤" : "😎"}
          </button>
        </div>

        <div className="fixed bottom-4 text-center text-gray-400 text-sm">
          {t("madeWith")} 🌞 {t("by")}{" "}
          <a
            href="https://github.com/baptiste-mnh"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            baptiste-mnh
          </a>
        </div>
      </div>

      <WeatherModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        lorientData={lorientData}
        brestData={brestData}
        comparison={comparison}
        lastFetchTime={lastFetchTime}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        language={settings.language}
      />
    </>
  );
};

WeatherDisplay.propTypes = {
  comparison: PropTypes.bool.isRequired,
  lorientData: PropTypes.object,
  brestData: PropTypes.object,
  onRetry: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  lastFetchTime: PropTypes.number,
};

export default WeatherDisplay;
