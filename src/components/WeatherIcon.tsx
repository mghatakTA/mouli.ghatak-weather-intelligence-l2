import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sparkles,
} from 'lucide-react';
import { WeatherConditionInfo } from '../types/weather';

interface WeatherIconProps {
  name: WeatherConditionInfo['iconName'];
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  switch (name) {
    case 'sun':
      return isDay ? (
        <Sun className={`${className} text-amber-500`} size={size} />
      ) : (
        <Sparkles className={`${className} text-amber-300`} size={size} />
      );
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-500`} size={size} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-400`} size={size} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} size={size} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-sky-400`} size={size} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-blue-500`} size={size} />;
    case 'cloud-snow':
      return <CloudSnow className={`${className} text-indigo-300`} size={size} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-amber-400`} size={size} />;
    default:
      return <Sun className={`${className} text-amber-500`} size={size} />;
  }
};
