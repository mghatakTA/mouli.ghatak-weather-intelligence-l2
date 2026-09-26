import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      {/* Current Weather Card Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-sm" />
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-sm" />
        </div>
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="h-8 w-56 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              </div>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-sm" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Panel Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-sm mb-2" />
        <div className="h-3 w-72 bg-slate-200 dark:bg-slate-800 rounded-sm mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-sm" />
                <div className="h-3 w-14 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-sm" />
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-5 w-60 bg-slate-200 dark:bg-slate-800 rounded-sm mb-2" />
        <div className="h-48 w-full bg-slate-100 dark:bg-slate-800/40 rounded-lg" />
      </div>

      {/* 7-Day Forecast Grid Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-5 w-52 bg-slate-200 dark:bg-slate-800 rounded-sm mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded-sm mx-auto" />
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-sm mx-auto" />
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
