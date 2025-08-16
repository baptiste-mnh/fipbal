import { X, Sun, Cloud, CloudRain, Clock } from "lucide-react";
import PropTypes from "prop-types";
import LastUpdateTime from "./LastUpdateTime";
import { useI18n } from "../contexts/I18nContext.jsx";

const getWeatherIcon = (weatherCode) => {
  if (weatherCode === 113) return <Sun className="w-8 h-8 text-yellow-500" />;
  if ([116, 119, 122, 143].includes(weatherCode))
    return <Cloud className="w-8 h-8 text-gray-500" />;
  return <CloudRain className="w-8 h-8 text-blue-500" />;
};

const formatObservationTime = (localObsDateTime) => {
  if (!localObsDateTime) return null;
  try {
    // Format: "2025-08-16 11:22 AM"
    const date = new Date(localObsDateTime);
    return date.toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return null;
  }
};

const WeatherModal = ({ isOpen, onClose, lorientData, brestData, lastFetchTime, onRefresh, isRefreshing = false }) => {
  const { t } = useI18n();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase text-gray-800">
              {t("weatherDetails")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t("close")}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Lorient */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold uppercase text-gray-800 mb-3 flex items-center gap-2">
                {getWeatherIcon(lorientData.weatherCode)}
                LORIENT
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 uppercase font-medium">
                  {lorientData.description}
                </p>
                <p className="text-2xl font-black text-gray-800">
                  {lorientData.temperature}°C
                </p>
                <p className="text-sm text-gray-600">
                  {t("feelsLike")}: {lorientData.feelsLike}°C
                </p>
                <p className="text-xs text-gray-500 uppercase">
                  {t("source")}: {lorientData.source}
                </p>
                {formatObservationTime(lorientData.localObsDateTime) && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatObservationTime(lorientData.localObsDateTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Brest */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold uppercase text-gray-800 mb-3 flex items-center gap-2">
                {getWeatherIcon(brestData.weatherCode)}
                BREST
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 uppercase font-medium">
                  {brestData.description}
                </p>
                <p className="text-2xl font-black text-gray-800">
                  {brestData.temperature}°C
                </p>
                <p className="text-sm text-gray-600">
                  {t("feelsLike")}: {brestData.feelsLike}°C
                </p>
                <p className="text-xs text-gray-500 uppercase">
                  {t("source")}: {brestData.source}
                </p>
                {formatObservationTime(brestData.localObsDateTime) && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatObservationTime(brestData.localObsDateTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Last Update Time */}
          <div className="mb-6">
            <LastUpdateTime 
              lastFetchTime={lastFetchTime}
              onRefresh={onRefresh}
              isRefreshing={isRefreshing}
            />
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white font-bold uppercase py-3 px-6 rounded hover:bg-gray-700 transition-colors mb-4"
          >
            {t("close")}
          </button>

          {/* Attribution footer */}
          <div className="text-center border-t pt-4">
            <p className="text-xs text-gray-500">
              {t("dataProvidedBy")}{" "}
              <span className="font-medium">wttr.in</span> et{" "}
              <span className="font-medium">Open-Meteo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lorientData: PropTypes.shape({
    weatherCode: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    localObsDateTime: PropTypes.string,
  }).isRequired,
  brestData: PropTypes.shape({
    weatherCode: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    feelsLike: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    localObsDateTime: PropTypes.string,
  }).isRequired,
  lastFetchTime: PropTypes.number,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool,
};

export default WeatherModal;
