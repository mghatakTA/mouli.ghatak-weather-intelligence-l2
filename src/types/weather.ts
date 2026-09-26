/**
 * Types for Weather Intelligence Application
 * Strictly typed interfaces for Open-Meteo Geocoding and Forecast API responses
 */

export interface GeoLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country_code?: string;
}

export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code?: string;
    admin1?: string;
    timezone?: string;
  }>;
  generationtime_ms?: number;
}

export interface CurrentWeatherRaw {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastRaw {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
}

export interface ForecastResponseRaw {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeatherRaw;
  daily: DailyForecastRaw;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning';
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
}

export interface DailyForecastDay {
  date: string;
  dayLabel: string;
  formattedDate: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  conditionLabel: string;
  precipitationSum: number;
  iconName: WeatherConditionInfo['iconName'];
}

export interface WeatherData {
  location: GeoLocation;
  current: {
    temperature: number;
    windSpeed: number;
    weatherCode: number;
    isDay: boolean;
    timestamp: string;
    condition: WeatherConditionInfo;
    todayMax: number;
    todayMin: number;
    todayPrecipitation: number;
  };
  daily: DailyForecastDay[];
  weeklyMin: number;
  weeklyMax: number;
  timezone: string;
  lastUpdated: Date;
}

export interface SmartRecommendation {
  id: string;
  category: 'rain' | 'temperature' | 'ideal' | 'wind' | 'outlook';
  priority: 'high' | 'medium' | 'normal';
  title: string;
  description: string;
  metricLabel: string;
  badgeType: 'warning' | 'alert' | 'success' | 'info';
}

export type TemperatureUnit = 'C' | 'F';
