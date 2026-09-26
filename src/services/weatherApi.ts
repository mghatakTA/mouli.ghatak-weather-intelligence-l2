/**
 * Open-Meteo Weather API Integration Service
 * Strictly uses public REST endpoints without requiring API keys or billing.
 */

import {
  GeoLocation,
  GeocodingResponse,
  ForecastResponseRaw,
  WeatherConditionInfo,
  WeatherData,
  DailyForecastDay,
  SmartRecommendation,
  TemperatureUnit,
} from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Maps WMO Weather Interpretation Codes (0-99) to human-readable labels,
 * descriptions, icon identifiers, and category groupings.
 */
export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: 'Sunny and completely cloudless sky',
        iconName: 'sun',
        category: 'clear',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Predominantly sunny with fleeting clear skies',
        iconName: 'sun',
        category: 'clear',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of sunshine',
        iconName: 'cloud-sun',
        category: 'cloudy',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Complete cloud cover across the sky',
        iconName: 'cloud',
        category: 'cloudy',
      };
    case 45:
      return {
        code,
        label: 'Fog',
        description: 'Dense fog reducing ground visibility',
        iconName: 'cloud-fog',
        category: 'fog',
      };
    case 48:
      return {
        code,
        label: 'Depositing Rime Fog',
        description: 'Freezing rime fog forming frost crystals',
        iconName: 'cloud-fog',
        category: 'fog',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        description: 'Fine light misting rain',
        iconName: 'cloud-drizzle',
        category: 'drizzle',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        description: 'Steady fine drizzle precipitation',
        iconName: 'cloud-drizzle',
        category: 'drizzle',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        description: 'Heavy drizzle with reduced visibility',
        iconName: 'cloud-drizzle',
        category: 'drizzle',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Supercooled drizzle freezing on contact',
        iconName: 'cloud-snow',
        category: 'drizzle',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        description: 'Gentle, light scattered rainfall',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Continuous steady moderate rain showers',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense heavy rain with potential water pooling',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Icy precipitation creating slick roadways',
        iconName: 'cloud-snow',
        category: 'rain',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow',
        description: 'Light gentle snowfall flutter',
        iconName: 'cloud-snow',
        category: 'snow',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        description: 'Steady snow flurries accumulating on ground',
        iconName: 'cloud-snow',
        category: 'snow',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow',
        description: 'Heavy snow shower with substantial accumulation',
        iconName: 'cloud-snow',
        category: 'snow',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Opaque ice pellets falling gently',
        iconName: 'cloud-snow',
        category: 'snow',
      };
    case 80:
      return {
        code,
        label: 'Slight Rain Showers',
        description: 'Brief, passing rain showers',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 81:
      return {
        code,
        label: 'Moderate Rain Showers',
        description: 'Periodic moderate rain showers',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 82:
      return {
        code,
        label: 'Violent Rain Showers',
        description: 'Torrents of rain with sudden gusts',
        iconName: 'cloud-rain',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Sudden flurries of blowing snow',
        iconName: 'cloud-snow',
        category: 'snow',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Thunder and lightning with rain bursts',
        iconName: 'cloud-lightning',
        category: 'storm',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm & Hail',
        description: 'Intense thunderstorm with hail and heavy gusts',
        iconName: 'cloud-lightning',
        category: 'storm',
      };
    default:
      return {
        code,
        label: 'Variable Conditions',
        description: 'Partially cloudy with changing conditions',
        iconName: 'cloud-sun',
        category: 'cloudy',
      };
  }
}

/**
 * Searches for a city name using Open-Meteo Geocoding API.
 * Resolves to { name, country, latitude, longitude } or throws on not found.
 */
export async function searchCityCoordinates(cityName: string): Promise<GeoLocation> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new Error('City name cannot be empty. Please enter a valid location.');
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding service unavailable (${response.status}). Please try again later.`);
  }

  const data: GeocodingResponse = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City not found. Please verify the location name and try again.`);
  }

  const result = data.results[0];
  return {
    name: result.name,
    country: result.country || '',
    latitude: result.latitude,
    longitude: result.longitude,
    admin1: result.admin1,
    country_code: result.country_code,
  };
}

/**
 * Fetches 7-day weather forecast and current weather for given coordinates.
 */
export async function fetchWeatherMetrics(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;
  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather forecast service unavailable (${response.status}). Please try again later.`);
  }

  const data: ForecastResponseRaw = await response.json();

  if (!data.current_weather || !data.daily || !data.daily.time || data.daily.time.length === 0) {
    throw new Error('Incomplete weather metrics received from provider.');
  }

  const currentCondition = getWeatherCondition(data.current_weather.weathercode);

  const dailyItems: DailyForecastDay[] = data.daily.time.map((dateStr, idx) => {
    const code = data.daily.weathercode[idx] ?? 0;
    const cond = getWeatherCondition(code);
    const dateObj = new Date(dateStr + 'T00:00:00');

    // Label day as "Today", "Tomorrow", or 3-letter weekday
    let dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    if (idx === 0) dayLabel = 'Today';
    else if (idx === 1) dayLabel = 'Tomorrow';

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      date: dateStr,
      dayLabel,
      formattedDate,
      tempMax: Math.round(data.daily.temperature_2m_max[idx] * 10) / 10,
      tempMin: Math.round(data.daily.temperature_2m_min[idx] * 10) / 10,
      weatherCode: code,
      conditionLabel: cond.label,
      precipitationSum: Math.round((data.daily.precipitation_sum[idx] ?? 0) * 10) / 10,
      iconName: cond.iconName,
    };
  });

  const allMax = dailyItems.map((d) => d.tempMax);
  const allMin = dailyItems.map((d) => d.tempMin);
  const weeklyMax = Math.max(...allMax);
  const weeklyMin = Math.min(...allMin);

  const today = dailyItems[0] || {
    tempMax: data.current_weather.temperature,
    tempMin: data.current_weather.temperature,
    precipitationSum: 0,
  };

  return {
    location,
    current: {
      temperature: Math.round(data.current_weather.temperature * 10) / 10,
      windSpeed: Math.round(data.current_weather.windspeed * 10) / 10,
      weatherCode: data.current_weather.weathercode,
      isDay: data.current_weather.is_day === 1,
      timestamp: data.current_weather.time,
      condition: currentCondition,
      todayMax: today.tempMax,
      todayMin: today.tempMin,
      todayPrecipitation: today.precipitationSum,
    },
    daily: dailyItems,
    weeklyMin,
    weeklyMax,
    timezone: data.timezone,
    lastUpdated: new Date(),
  };
}

/**
 * Generates automated smart planning advice based strictly on user-specified heuristics:
 * 1. Rain Alert: If daily precipitation > 0.5mm, suggest carrying an umbrella.
 * 2. Temperature Alert: If current temp > 30°C, recommend staying hydrated; if < 15°C, recommend warm clothing.
 * 3. Ideal Weather: If clear/partly cloudy (codes 0, 1, 2) and pleasant temp (18°C - 28°C), recommend outdoor activities.
 * 4. Wind Alert: If wind speed > 25 km/h, recommend windbreaker / caution with cycling or outdoor fixtures.
 * 5. Weekly Outlook: Identifies the best day in the 7-day forecast.
 */
export function generateSmartRecommendations(weather: WeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const { current, daily } = weather;
  const todayPrecip = current.todayPrecipitation;
  const currentTemp = current.temperature;
  const windSpeed = current.windSpeed;
  const code = current.weatherCode;

  // 1. Rain Alert Heuristic
  if (todayPrecip > 0.5) {
    recommendations.push({
      id: 'rain-alert',
      category: 'rain',
      priority: 'high',
      title: 'Rain Protection Alert',
      description: `Daily precipitation is expected to reach ${todayPrecip} mm. Keep an umbrella ready and plan covered transit routes.`,
      metricLabel: `${todayPrecip} mm expected`,
      badgeType: 'warning',
    });
  } else {
    recommendations.push({
      id: 'dry-conditions',
      category: 'rain',
      priority: 'normal',
      title: 'Minimal Rain Risk',
      description: `Precipitation remains near zero (${todayPrecip} mm). Safe for dry outdoor commuting and events.`,
      metricLabel: 'Dry (<0.5 mm)',
      badgeType: 'info',
    });
  }

  // 2. Temperature Alert Heuristic
  if (currentTemp > 30) {
    recommendations.push({
      id: 'heat-alert',
      category: 'temperature',
      priority: 'high',
      title: 'High Heat Precaution',
      description: `Temperature is at ${currentTemp}°C. Stay well hydrated, seek shade during peak midday hours, and wear lightweight, breathable clothing.`,
      metricLabel: `${currentTemp}°C Heat`,
      badgeType: 'alert',
    });
  } else if (currentTemp < 15) {
    recommendations.push({
      id: 'cold-alert',
      category: 'temperature',
      priority: 'high',
      title: 'Warm Layers Recommended',
      description: `Current reading is ${currentTemp}°C. Cooler than average—wear an insulated jacket, wind-resistant layers, or warm knitwear.`,
      metricLabel: `${currentTemp}°C Cool`,
      badgeType: 'warning',
    });
  } else {
    recommendations.push({
      id: 'moderate-temp',
      category: 'temperature',
      priority: 'normal',
      title: 'Balanced Thermal Comfort',
      description: `At ${currentTemp}°C, thermal conditions are comfortable. Standard daily casual attire is well-suited for all hours.`,
      metricLabel: `${currentTemp}°C Moderate`,
      badgeType: 'info',
    });
  }

  // 3. Ideal Weather Heuristic
  const isClearOrPartlyCloudy = [0, 1, 2].includes(code);
  const isPleasantTemp = currentTemp >= 18 && currentTemp <= 28;

  if (isClearOrPartlyCloudy && isPleasantTemp && todayPrecip <= 0.5) {
    recommendations.push({
      id: 'ideal-outdoor',
      category: 'ideal',
      priority: 'high',
      title: 'Optimal Outdoor Window',
      description: `Clear skies with pleasant ${currentTemp}°C warmth. Prime conditions for outdoor runs, dining al fresco, photography, or park walks.`,
      metricLabel: 'Ideal Conditions',
      badgeType: 'success',
    });
  }

  // 4. Wind Alert Heuristic
  if (windSpeed > 25) {
    recommendations.push({
      id: 'wind-alert',
      category: 'wind',
      priority: 'medium',
      title: 'Brisk Wind Warning',
      description: `Sustained wind speeds of ${windSpeed} km/h recorded. Secure loose outdoor items and anticipate headwind drag if cycling.`,
      metricLabel: `${windSpeed} km/h Gusts`,
      badgeType: 'warning',
    });
  }

  // 5. 7-Day Planning Insight: Find the peak warm/dry day
  if (daily.length > 1) {
    const futureDays = daily.slice(1);
    // Find best upcoming day: lowest precipitation and comfortable max temp between 20-27
    const bestDay = futureDays.reduce((best, curr) => {
      const bestScore = (best.precipitationSum === 0 ? 10 : 0) - Math.abs(best.tempMax - 22);
      const currScore = (curr.precipitationSum === 0 ? 10 : 0) - Math.abs(curr.tempMax - 22);
      return currScore > bestScore ? curr : best;
    }, futureDays[0]);

    if (bestDay) {
      recommendations.push({
        id: 'week-outlook',
        category: 'outlook',
        priority: 'normal',
        title: `Best Weekly Window: ${bestDay.dayLabel}`,
        description: `${bestDay.dayLabel} (${bestDay.formattedDate}) projects high of ${bestDay.tempMax}°C with ${bestDay.precipitationSum} mm rain—great candidate for planned outings.`,
        metricLabel: `${bestDay.tempMax}°C / ${bestDay.precipitationSum}mm`,
        badgeType: 'info',
      });
    }
  }

  return recommendations;
}

/**
 * Temperature Unit Conversion Helpers
 */
export function celsiusToFahrenheit(c: number): number {
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${celsius}°C`;
}

export function formatTempNumber(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return celsiusToFahrenheit(celsius);
  }
  return celsius;
}
