import { RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import { useI18n } from "../contexts/I18nContext.jsx";

const LastUpdateTime = ({ lastFetchTime, onRefresh, isRefreshing = false }) => {
  const { t } = useI18n();
  
  if (!lastFetchTime) {
    return (
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <span>{t("loadingData")}</span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 hover:text-gray-700 transition-colors disabled:opacity-50"
          aria-label={t("refreshData")}
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="font-medium">{t("refresh")}</span>
        </button>
      </div>
    );
  }

  const now = Date.now();
  const timeDiff = now - lastFetchTime;
  const oneHour = 60 * 60 * 1000; // 1 heure en millisecondes

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayText = () => {
    if (timeDiff < oneHour) {
      return t("dataRetrievedLessThanHour");
    }
    return `${t("lastUpdate")}: ${formatTime(lastFetchTime)}`;
  };

  return (
    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
      <span>{getDisplayText()}</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1 hover:text-gray-700 transition-colors disabled:opacity-50"
        aria-label={t("refreshData")}
      >
        <RefreshCw
          className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span className="font-medium">{t("refresh")}</span>
      </button>
    </div>
  );
};

LastUpdateTime.propTypes = {
  lastFetchTime: PropTypes.number,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool,
};

export default LastUpdateTime;
