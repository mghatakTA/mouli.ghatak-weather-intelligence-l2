import React from 'react';
import { Wind, Droplets, ArrowUp, ArrowDown, Compass, Clock } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature, formatTempNumber } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
}) => {
  const { location, current, timezone } = weather;
  const currentTempDisplay = formatTempNumber(current.temperature, unit);
  const maxTempDisplay = formatTempNumber(current.todayMax, unit);
  const minTempDisplay = formatTempNumber(current.todayMin, unit);

  // Format current local time using the timezone returned by Open-Meteo
  let localTimeString = '';
  try {
    const now = new Date();
    localTimeString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
  } catch {
    localTimeString = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      {/* Top Metadata Row: Unboxed text with subtle typographic separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{localTimeString}</span>
          <span aria-hidden="true">·</span>
          <span>{timezone}</span>
        </div>
        <div className="flex items-center gap-2 font-mono tabular-nums text-slate-400">
          <span>{location.latitude.toFixed(2)}°N</span>
          <span aria-hidden="true">·</span>
          <span>{location.longitude.toFixed(2)}°E</span>
        </div>
      </div>

      {/* Main Weather Overview */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: City, Condition, Hero Temperature */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {location.name}
            </h2>
            {location.country && (
              <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                {location.country}
              </span>
            )}
            {location.admin1 && (
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                ({location.admin1})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xs">
              <WeatherIcon
                name={current.condition.iconName}
                isDay={current.isDay}
                className="w-12 h-12"
              />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                {currentTempDisplay}°{unit}
              </div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>{current.condition.label}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  {current.condition.description}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Meteorological Metrics Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3">
          {/* Today's High / Low */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Today's High / Low
            </span>
            <div className="flex items-center gap-3 font-mono tabular-nums text-sm font-semibold">
              <span className="text-slate-900 dark:text-white flex items-center gap-0.5">
                <ArrowUp className="w-3.5 h-3.5 text-amber-500 inline" />
                {maxTempDisplay}°
              </span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-blue-400 inline" />
                {minTempDisplay}°
              </span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Wind Velocity
            </span>
            <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>{current.windSpeed} km/h</span>
            </div>
          </div>

          {/* Precipitation Today */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Precipitation (24h)
            </span>
            <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{current.todayPrecipitation} mm</span>
            </div>
          </div>

          {/* Solar / Diurnal Phase */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Solar Cycle
            </span>
            <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">{current.isDay ? 'Daylight' : 'Night'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
