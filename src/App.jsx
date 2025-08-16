import { useWeatherData } from "./hooks/useWeatherData.js";
import LoadingState from "./components/LoadingState.jsx";
import WeatherDisplay from "./components/WeatherDisplay.jsx";
import PWAInstallBanner from "./components/PWAInstallBanner.jsx";
import { I18nProvider } from "./contexts/I18nContext.jsx";

function App() {
  const { loading, error, lorientData, brestData, comparison, retry, refresh, lastFetchTime } =
    useWeatherData();

  if (loading) {
    return (
      <I18nProvider>
        <LoadingState />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      <WeatherDisplay
        comparison={error ? null : comparison}
        lorientData={lorientData}
        brestData={brestData}
        onRetry={retry}
        onRefresh={refresh}
        lastFetchTime={lastFetchTime}
      />
      <PWAInstallBanner />
    </I18nProvider>
  );
}

export default App;
