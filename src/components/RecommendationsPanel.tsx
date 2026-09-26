import React from 'react';
import {
  Umbrella,
  Thermometer,
  Compass,
  Wind,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { SmartRecommendation } from '../types/weather';

interface RecommendationsPanelProps {
  recommendations: SmartRecommendation[];
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
}) => {
  const getCategoryIcon = (category: SmartRecommendation['category']) => {
    switch (category) {
      case 'rain':
        return <Umbrella className="w-4 h-4 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-amber-500" />;
      case 'ideal':
        return <Compass className="w-4 h-4 text-emerald-500" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-sky-500" />;
      case 'outlook':
        return <CalendarCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusIndicator = (badgeType: SmartRecommendation['badgeType']) => {
    switch (badgeType) {
      case 'alert':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High Notice</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Advisory</span>
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Favorable</span>
          </span>
        );
      case 'info':
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>Standard</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Smart Daily Planning Advice
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated contextual recommendations derived from current & forecast metrics
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                </div>
                {getStatusIndicator(rec.badgeType)}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {rec.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span>Metric Trigger:</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {rec.metricLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
