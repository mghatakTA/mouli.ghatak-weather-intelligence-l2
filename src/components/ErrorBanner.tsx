import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
  onSelectCity?: (cityName: string) => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
  onSelectCity,
}) => {
  return (
    <div className="w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-4 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-300 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
              Weather Data Retrieval Notice
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5 leading-relaxed">
              {message}
            </p>

            {/* Recovery actions */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1 text-xs font-medium rounded-md bg-red-700 dark:bg-red-600 text-white hover:bg-red-800 dark:hover:bg-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Try Again</span>
              </button>

              {onSelectCity && (
                <div className="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300">
                  <span>Try major centers:</span>
                  {['London', 'Chennai', 'Tokyo'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => onSelectCity(city)}
                      className="underline hover:text-red-900 dark:hover:text-white font-medium cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-md text-red-500 hover:text-red-800 dark:hover:text-red-300 transition-colors cursor-pointer"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
