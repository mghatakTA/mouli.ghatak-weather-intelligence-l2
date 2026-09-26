/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SearchHeader } from './components/SearchHeader';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { ForecastGrid } from './components/ForecastGrid';
import { ErrorBanner } from './components/ErrorBanner';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import {
  searchCityCoordinates,
  fetchWeatherMetrics,
  generateSmartRecommendations,
} from './services/weatherApi';
import { WeatherData, SmartRecommendation, TemperatureUnit } from './types/weather';
import { CloudRain, Globe } from 'lucide-react';

const DEFAULT_CITY = 'London';

export default function App() {
  const [currentCity, setCurrentCity] = useState<string>(DEFAULT_CITY);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');

  const loadWeatherForCity = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Geocoding search to coordinates
      const location = await searchCityCoordinates(cityName);

      // Step 2: Weather metrics retrieval
      const weatherData = await fetchWeatherMetrics(location);

      // Step 3: Heuristic smart recommendations
      const recs = generateSmartRecommendations(weatherData);

      setWeather(weatherData);
      setRecommendations(recs);
      setCurrentCity(location.name);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to retrieve weather data. Please check your network and try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadWeatherForCity(DEFAULT_CITY);
  }, [loadWeatherForCity]);

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleRefresh = () => {
    loadWeatherForCity(currentCity);
  };

  const handleDismissError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 font-sans">
      {/* Search Header */}
      <SearchHeader
        currentCity={currentCity}
        onSearch={loadWeatherForCity}
        isLoading={isLoading}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onRetry={handleRefresh}
            onDismiss={handleDismissError}
            onSelectCity={loadWeatherForCity}
          />
        )}

        {/* Loading Skeleton during initial load */}
        {isLoading && !weather ? (
          <LoadingSkeleton />
        ) : (
          weather && (
            <div className="space-y-6 transition-opacity duration-200">
              {/* Top Section: Real-Time Current Weather Card */}
              <CurrentWeatherCard weather={weather} unit={unit} />

              {/* Middle Section: Smart Planning Recommendations */}
              <RecommendationsPanel recommendations={recommendations} />

              {/* Interactive Visual Temperature Trend Chart */}
              <TemperatureTrendChart daily={weather.daily} unit={unit} />

              {/* 7-Day Detailed Meteorological Grid */}
              <ForecastGrid
                daily={weather.daily}
                weeklyMin={weather.weeklyMin}
                weeklyMax={weather.weeklyMax}
                unit={unit}
              />
            </div>
          )
        )}
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>
              Powered by Open-Meteo Public Weather & Geocoding REST APIs (WMO standard)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Repository: mouli.ghatak-weather-intelligence-l2</span>
            <span aria-hidden="true">·</span>
            <span>Target: Cloudflare Pages</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
