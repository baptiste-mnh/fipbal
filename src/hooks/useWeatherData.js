import { useState, useEffect } from "react";
import { fetchWeatherData } from "../utils/weatherAPI.js";
import { compareWeather } from "../utils/weatherScoring.js";
import { useSettings } from "./useSettings.js";

const CACHE_KEY = "fipbal-cache";
const CACHE_DURATION = 30 * 60 * 1000;

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp, lastFetchTime } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return { ...data, lastFetchTime: lastFetchTime || Date.now() };
  } catch (error) {
    console.warn("Erreur lors de la lecture du cache:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedData = (data, lastFetchTime = Date.now()) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      lastFetchTime,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn("Erreur lors de la sauvegarde du cache:", error);
  }
};

export const useWeatherData = () => {
  const { settings } = useSettings();
  const [state, setState] = useState({
    loading: true,
    error: null,
    lorientData: null,
    brestData: null,
    comparison: null,
    lastFetchTime: null,
  });

  const loadWeatherData = async (forceRefresh = false) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setState({
          loading: false,
          error: null,
          lorientData: cachedData.lorientData,
          brestData: cachedData.brestData,
          comparison: cachedData.comparison,
          lastFetchTime: cachedData.lastFetchTime || Date.now(),
        });
        return;
      }
    }

    try {
      const data = await fetchWeatherData(
        forceRefresh,
        settings.weatherProvider
      );

      if (data.error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: data.error,
        }));
        return;
      }

      const comparison = compareWeather(data.lorient, data.brest);
      const fetchTime = Date.now(); // Timestamp du fetch depuis le navigateur

      const newState = {
        loading: false,
        error: null,
        lorientData: data.lorient,
        brestData: data.brest,
        comparison,
        lastFetchTime: fetchTime,
      };

      // Sauvegarder en cache
      setCachedData(
        {
          lorientData: data.lorient,
          brestData: data.brest,
          comparison,
        },
        fetchTime
      );

      setState(newState);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Erreur lors du chargement des données météo",
      }));
    }
  };

  useEffect(() => {
    loadWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.weatherProvider]);

  return {
    ...state,
    retry: () => loadWeatherData(true), // Force refresh lors du retry
    refresh: () => loadWeatherData(true), // Nouvelle méthode pour forcer le refresh
  };
};
