import React, { useState } from 'react';
import { Search, Loader2, RotateCw, MapPin } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface SearchHeaderProps {
  currentCity: string;
  onSearch: (cityName: string) => void;
  isLoading: boolean;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
}

const PRESET_CITIES = [
  'Chennai',
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'San Francisco',
];

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  currentCity,
  onSearch,
  isLoading,
  unit,
  onToggleUnit,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) {
      setInputError('Please enter a city or location name.');
      return;
    }
    setInputError(null);
    onSearch(query);
  };

  const handlePresetClick = (city: string) => {
    setInputError(null);
    setSearchTerm('');
    onSearch(city);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (inputError && e.target.value.trim().length > 0) {
      setInputError(null);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Bar Zone: Wordmark + Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-semibold shadow-xs">
                <span className="text-base tracking-tighter">WI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Weather Intelligence
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global Meteorologic Dashboard
                </p>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onToggleUnit}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                title="Switch Temperature Unit"
              >
                °{unit}
              </button>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                title="Refresh current metrics"
              >
                <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search city (e.g., Chennai, London, Tokyo)..."
                className={`w-full pl-9 pr-32 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border transition-all focus:outline-hidden ${
                  inputError
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-slate-300 focus:bg-white dark:focus:bg-slate-900'
                } text-slate-900 dark:text-white placeholder-slate-400`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1 px-3.5 py-1.5 text-xs font-medium rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Search City</span>
                )}
              </button>
            </div>
            {inputError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-1">{inputError}</p>
            )}
          </form>

          {/* Desktop Unit & Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => unit !== 'C' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  unit === 'C'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => unit !== 'F' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  unit === 'F'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              title="Refresh weather data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Preset Cities Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="shrink-0 flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400" /> Quick Select:
          </span>
          <div className="flex items-center gap-1.5">
            {PRESET_CITIES.map((city) => {
              const isActive = currentCity.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handlePresetClick(city)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
