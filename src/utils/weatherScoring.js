export const getWeatherScore = (weatherCode) => {
  if (weatherCode === 113) return 1; // Sunny
  if (weatherCode === 116) return 2; // Partly cloudy
  if ([119, 122].includes(weatherCode)) return 3; // Cloudy
  if (weatherCode >= 176 && weatherCode <= 314) return 4; // Light rain/drizzle
  if (weatherCode >= 317) return 5; // Heavy rain/storms
  if (weatherCode === 143) return 3; // Mist (treated as cloudy)
  if (weatherCode >= 200 && weatherCode <= 230) return 5; // Thunderstorms
  if (weatherCode >= 263 && weatherCode <= 284) return 4; // Rain
  if (weatherCode >= 317 && weatherCode <= 395) return 5; // Heavy rain/showers
  if (weatherCode >= 368 && weatherCode <= 392) return 4; // Snow (treated as moderate)

  return 3; // Default to cloudy for unknown codes
};

export const convertOpenMeteoToWttr = (openMeteoCode) => {
  const conversions = {
    0: 113, // Clear sky -> Sunny
    1: 116, // Mainly clear -> Partly cloudy
    2: 116, // Partly cloudy -> Partly cloudy
    3: 119, // Overcast -> Cloudy
    45: 143, // Fog -> Mist
    48: 143, // Depositing rime fog -> Mist
    51: 176, // Light drizzle -> Light rain
    53: 176, // Moderate drizzle -> Light rain
    55: 263, // Dense drizzle -> Rain
    56: 176, // Light freezing drizzle -> Light rain
    57: 263, // Dense freezing drizzle -> Rain
    61: 176, // Slight rain -> Light rain
    63: 263, // Moderate rain -> Rain
    65: 317, // Heavy rain -> Heavy rain
    66: 176, // Light freezing rain -> Light rain
    67: 317, // Heavy freezing rain -> Heavy rain
    71: 368, // Slight snow fall -> Snow
    73: 368, // Moderate snow fall -> Snow
    75: 368, // Heavy snow fall -> Snow
    77: 368, // Snow grains -> Snow
    80: 317, // Slight rain showers -> Heavy rain
    81: 317, // Moderate rain showers -> Heavy rain
    82: 317, // Violent rain showers -> Heavy rain
    85: 368, // Slight snow showers -> Snow
    86: 368, // Heavy snow showers -> Snow
    95: 200, // Thunderstorm slight -> Thunderstorm
    96: 200, // Thunderstorm with slight hail -> Thunderstorm
    99: 200, // Thunderstorm with heavy hail -> Thunderstorm
  };

  return conversions[openMeteoCode] || 119; // Default to cloudy
};

export const compareWeather = (lorientData, brestData) => {
  const lorientScore = getWeatherScore(lorientData.weatherCode);
  const brestScore = getWeatherScore(brestData.weatherCode);

  // Lower score = better weather
  if (lorientScore < brestScore) {
    return true;
  }

  if (brestScore < lorientScore) {
    return false;
  }

  if (lorientData.temperature > brestData.temperature) {
    return true;
  }

  if (brestData.temperature > lorientData.temperature) {
    return false;
  }

  // Perfect equality
  return false;
};
