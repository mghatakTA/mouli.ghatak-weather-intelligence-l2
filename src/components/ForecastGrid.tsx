import React from 'react';
import { DailyForecastDay, TemperatureUnit } from '../types/weather';
import { formatTempNumber } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';

interface ForecastGridProps {
  daily: DailyForecastDay[];
  weeklyMin: number;
  weeklyMax: number;
  unit: TemperatureUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  weeklyMin,
  weeklyMax,
  unit,
}) => {
  const weeklyRange = weeklyMax - weeklyMin || 1;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            7-Day Detailed Meteorological Outlook
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Consecutive daily forecasts with diurnal extremes and precipitation probability
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const maxDisplay = formatTempNumber(day.tempMax, unit);
          const minDisplay = formatTempNumber(day.tempMin, unit);

          // Calculate bar placement relative to weekly min/max (using Celsius scale for ratio)
          const leftPercent = Math.max(0, ((day.tempMin - weeklyMin) / weeklyRange) * 100);
          const rightPercent = Math.min(100, ((day.tempMax - weeklyMin) / weeklyRange) * 100);
          const barWidth = Math.max(8, rightPercent - leftPercent);

          const isToday = idx === 0;

          return (
            <div
              key={day.date}
              className={`flex flex-col justify-between p-3.5 rounded-lg border transition-all ${
                isToday
                  ? 'bg-slate-50/90 dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {day.dayLabel}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                  {day.formattedDate}
                </span>
              </div>

              {/* Weather Condition & Icon */}
              <div className="py-3 flex flex-col items-center text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 mb-1.5">
                  <WeatherIcon name={day.iconName} className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                  {day.conditionLabel}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>{day.precipitationSum} mm</span>
                </span>
              </div>

              {/* Temperature Range Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums font-semibold mb-1.5">
                  <span className="text-slate-900 dark:text-white">{maxDisplay}°</span>
                  <span className="text-slate-400 dark:text-slate-500">{minDisplay}°</span>
                </div>

                {/* Visual horizontal spectrum bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
