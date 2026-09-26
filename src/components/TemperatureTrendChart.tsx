import React, { useState } from 'react';
import { DailyForecastDay, TemperatureUnit } from '../types/weather';
import { formatTempNumber } from '../services/weatherApi';
import { Droplets } from 'lucide-react';

interface TemperatureTrendChartProps {
  daily: DailyForecastDay[];
  unit: TemperatureUnit;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  daily,
  unit,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!daily || daily.length === 0) return null;

  // Compute temperatures in current unit
  const points = daily.map((d, i) => ({
    index: i,
    label: d.dayLabel,
    date: d.formattedDate,
    max: formatTempNumber(d.tempMax, unit),
    min: formatTempNumber(d.tempMin, unit),
    precip: d.precipitationSum,
    condition: d.conditionLabel,
  }));

  const allTemps = points.flatMap((p) => [p.max, p.min]);
  const minTemp = Math.floor(Math.min(...allTemps) - 2);
  const maxTemp = Math.ceil(Math.max(...allTemps) + 3);
  const tempRange = maxTemp - minTemp || 1;

  // SVG dimensions
  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (points.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (points.length - 1)) * chartWidth;
  };

  const getY = (temp: number) => {
    const fraction = (temp - minTemp) / tempRange;
    return height - paddingBottom - fraction * chartHeight;
  };

  // Generate SVG path strings for Max and Min curves
  const maxPathData = points.reduce((acc, p, i) => {
    const x = getX(i);
    const y = getY(p.max);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const minPathData = points.reduce((acc, p, i) => {
    const x = getX(i);
    const y = getY(p.min);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill area between high and low curves
  const reversedMinPath = points
    .slice()
    .reverse()
    .map((p) => `${getX(p.index)} ${getY(p.min)}`)
    .join(' L ');
  const areaPathData = `${maxPathData} L ${reversedMinPath} Z`;

  // Find max precipitation to scale precip indicators
  const maxPrecip = Math.max(...points.map((p) => p.precip), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            7-Day Temperature Trend & Dynamic Range
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thermal variance curve showcasing diurnal high/low trajectories (°{unit})
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>High Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>Low Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500/40 inline-block" />
            <span>Precipitation</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="mt-4 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const tempVal = Math.round(minTemp + ratio * tempRange);
            const y = height - paddingBottom - ratio * chartHeight;
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono tabular-nums"
                >
                  {tempVal}°
                </text>
              </g>
            );
          })}

          {/* Area between curves */}
          <path d={areaPathData} fill="url(#tempAreaGradient)" />

          {/* Lines */}
          <path
            d={maxPathData}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={minPathData}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Guides & Data Points */}
          {points.map((p, i) => {
            const x = getX(i);
            const yMax = getY(p.max);
            const yMin = getY(p.min);
            const isHovered = hoveredIndex === i;

            // Precip column at bottom
            const barHeight = Math.max(3, (p.precip / maxPrecip) * 22);
            const barY = height - paddingBottom + 20 - barHeight;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Column Hitbox */}
                <rect
                  x={x - chartWidth / (points.length * 2)}
                  y={paddingTop}
                  width={chartWidth / points.length}
                  height={chartHeight + 40}
                  fill="transparent"
                />

                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="opacity-70"
                  />
                )}

                {/* Max point circle & label */}
                <circle
                  cx={x}
                  cy={yMax}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  className="transition-all"
                />
                <text
                  x={x}
                  y={yMax - 9}
                  textAnchor="middle"
                  className="fill-slate-800 dark:fill-slate-200 text-[11px] font-mono tabular-nums font-semibold"
                >
                  {p.max}°
                </text>

                {/* Min point circle & label */}
                <circle
                  cx={x}
                  cy={yMin}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="transition-all"
                />
                <text
                  x={x}
                  y={yMin + 16}
                  textAnchor="middle"
                  className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono tabular-nums font-medium"
                >
                  {p.min}°
                </text>

                {/* Precipitation indicator column */}
                {p.precip > 0 ? (
                  <rect
                    x={x - 3}
                    y={barY}
                    width="6"
                    height={barHeight}
                    rx="2"
                    fill="#3b82f6"
                    opacity={isHovered ? 0.9 : 0.6}
                  />
                ) : (
                  <circle
                    cx={x}
                    cy={height - paddingBottom + 18}
                    r="1.5"
                    fill="#cbd5e1"
                    className="dark:fill-slate-700"
                  />
                )}

                {/* Day label on X Axis */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered
                      ? 'fill-slate-900 dark:fill-white font-semibold'
                      : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Day Tooltip Box */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute top-1 right-2 pointer-events-none bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-xs px-3 py-2 rounded-lg text-xs shadow-md border border-slate-700 font-mono tabular-nums space-y-1"
          >
            <div className="font-semibold text-slate-200">
              {points[hoveredIndex].label} · {points[hoveredIndex].date}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span>{points[hoveredIndex].condition}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400">High: {points[hoveredIndex].max}°{unit}</span>
              <span className="text-sky-300">Low: {points[hoveredIndex].min}°{unit}</span>
            </div>
            {points[hoveredIndex].precip > 0 && (
              <div className="flex items-center gap-1 text-blue-300">
                <Droplets className="w-3 h-3" />
                <span>Precipitation: {points[hoveredIndex].precip} mm</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
