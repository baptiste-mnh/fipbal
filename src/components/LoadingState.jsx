import { useState, useEffect } from 'react';
import { useI18n } from "../contexts/I18nContext.jsx";

const LoadingState = () => {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const { t } = useI18n();
  
  const weatherEmojis = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌦️', '🌤️', '🌩️'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % weatherEmojis.length);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-800 uppercase mb-8">
          {t("title")}
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl md:text-8xl animate-pulse">
            {weatherEmojis[currentEmoji]}
          </div>
          <div className="text-lg md:text-2xl font-bold text-gray-600 uppercase">
            {t("loadingAnalysis")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;