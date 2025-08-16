import { convertOpenMeteoToWttr } from "./weatherScoring.js";

const CITIES = {
  lorient: { lat: 47.7482, lon: -3.3667, name: "Lorient" },
  brest: { lat: 48.3904, lon: -4.4861, name: "Brest" },
};

const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ]);
};

const fetchWttrWeather = async (cityName, forceRefresh = false) => {
  try {
    // Simple cache-busting parameter
    const cacheBuster = forceRefresh
      ? Date.now()
      : Math.floor(Date.now() / 900000) * 900000; // 15-minute intervals

    const params = new URLSearchParams({
      format: "j1",
      t: cacheBuster,
      lang: "fr",
    });

    const url = `https://wttr.in/${cityName}?${params.toString()}`;

    const response = await fetchWithTimeout(url, 8000);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current_condition || !data.current_condition[0]) {
      throw new Error("Invalid data structure");
    }

    const current = data.current_condition[0];

    return {
      city: cityName,
      temperature: parseInt(current.temp_C),
      feelsLike: parseInt(current.FeelsLikeC),
      weatherCode: parseInt(current.weatherCode),
      description: current.weatherDesc[0].value,
      source: "wttr.in",
      observationTime: current.observation_time,
      localObsDateTime: current.localObsDateTime,
    };
  } catch (error) {
    console.warn(`wttr.in failed for ${cityName}:`, error.message);
    throw error;
  }
};

const fetchOpenMeteoWeather = async (cityKey) => {
  try {
    const city = CITIES[cityKey];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&temperature_unit=celsius&timezone=Europe%2FParis`;

    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    const current = data.current_weather;

    // Convert Open-Meteo weather code to wttr.in equivalent
    const wttrCode = convertOpenMeteoToWttr(current.weathercode);

    return {
      city: city.name,
      temperature: Math.round(current.temperature),
      feelsLike: Math.round(current.temperature), // Open-Meteo doesn't provide feels-like
      weatherCode: wttrCode,
      description: getWeatherDescription(wttrCode),
      source: "open-meteo",
      observationTime: new Date(current.time).toISOString(),
      localObsDateTime: current.time,
    };
  } catch (error) {
    console.warn(`Open-Meteo failed for ${cityKey}:`, error.message);
    throw error;
  }
};

const getWeatherDescription = (weatherCode) => {
  const descriptions = {
    113: "Sunny",
    116: "Partly cloudy",
    119: "Cloudy",
    122: "Overcast",
    143: "Mist",
    176: "Patchy rain possible",
    200: "Thundery outbreaks possible",
    263: "Patchy light rain",
    317: "Light rain shower",
    368: "Light snow",
  };

  return descriptions[weatherCode] || "Unknown";
};

export const fetchWeatherData = async (
  forceRefresh = false,
  weatherProvider = "openmeteo"
) => {
  const results = { lorient: null, brest: null, error: null };

  if (weatherProvider === "openmeteo") {
    // Use Open-Meteo first
    try {
      const [lorientData, brestData] = await Promise.all([
        fetchOpenMeteoWeather("lorient"),
        fetchOpenMeteoWeather("brest"),
      ]);

      results.lorient = lorientData;
      results.brest = brestData;
      return results;
    } catch (error) {
      console.warn("Open-Meteo failed, trying wttr.in as fallback...");
    }

    // Fallback to wttr.in
    try {
      const [lorientData, brestData] = await Promise.all([
        fetchWttrWeather("Lorient", forceRefresh),
        fetchWttrWeather("Brest", forceRefresh),
      ]);

      results.lorient = lorientData;
      results.brest = brestData;
      return results;
    } catch (error) {
      console.error("All weather APIs failed:", error);
      results.error = "Impossible de récupérer les données météo";
      return results;
    }
  } else {
    // Use wttr.in first (default behavior)
    try {
      const [lorientData, brestData] = await Promise.all([
        fetchWttrWeather("Lorient", forceRefresh),
        fetchWttrWeather("Brest", forceRefresh),
      ]);

      results.lorient = lorientData;
      results.brest = brestData;
      return results;
    } catch (error) {
      console.warn("wttr.in failed for both cities, trying Open-Meteo...");
    }

    // Fallback to Open-Meteo
    try {
      const [lorientData, brestData] = await Promise.all([
        fetchOpenMeteoWeather("lorient"),
        fetchOpenMeteoWeather("brest"),
      ]);

      results.lorient = lorientData;
      results.brest = brestData;
      return results;
    } catch (error) {
      console.error("All weather APIs failed:", error);
      results.error = "Impossible de récupérer les données météo";
      return results;
    }
  }
};
