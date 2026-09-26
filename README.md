# Weather Intelligence (L2) - SPA

A high-performance, responsive Weather Intelligence Single Page Application built with React 19, TypeScript, Vite, and Tailwind CSS. The dashboard provides real-time atmospheric metrics, 7-day meteorological forecasts, interactive temperature trend charts, and automated daily planning recommendations using public Open-Meteo REST APIs without requiring private keys or external credentials.

**Target Repository**: [https://github.com/mghatakTA/mouli.ghatak-weather-intelligence-l2](https://github.com/mghatakTA/mouli.ghatak-weather-intelligence-l2)

---

## Features

- **Global City Search & Preset Access**:
  - Instant location lookup using Open-Meteo Geocoding API with input validation.
  - Quick-select pills for major global centers: Chennai, London, New York, Tokyo, Paris, and San Francisco.
  - Real-time loading indicators and refresh affordance.

- **Real-Time Current Weather Card**:
  - Displays localized current temperature (°C / °F toggle), wind velocity (km/h), diurnal cycle (Day/Night), and 24-hour precipitation accumulation.
  - Complete mapping of WMO Weather Interpretation Codes (0–99) to human-readable labels and dynamic condition icons.
  - Local timezone clock and coordinate precision.

- **Smart Automated Planning Recommendations**:
  - **Rain Protection Alert**: Automatically flags if precipitation > 0.5 mm and advises carrying an umbrella.
  - **Temperature Caution**: Recommends hydration for temperatures > 30°C, or thermal layering when < 15°C.
  - **Optimal Outdoor Window**: Detects ideal outdoor activity windows (clear/partly cloudy conditions between 18°C–28°C with minimal rain).
  - **Wind Alert**: Warns when sustained wind gusts exceed 25 km/h.
  - **Weekly Planning Insight**: Highlights the best upcoming day for travel or outdoor scheduling.

- **Interactive 7-Day Temperature Trend Chart**:
  - Responsive SVG visualization plotting diurnal highs and lows.
  - Hover tooltip with exact day forecasts and precipitation depth bars.
  - Area-fill thermal gradient between daytime peaks and nightly troughs.

- **7-Day Meteorological Forecast Grid**:
  - Daily cards showing weather icons, conditions, high/low figures, and daily precipitation sums.
  - Dynamic horizontal spectrum indicator positioning each day relative to the 7-day minimum and maximum extremes.

- **Resilience & Error Handling**:
  - Clean skeleton loading states during fetch sequences to prevent cumulative layout shift.
  - Graceful dismissible error banner with retry triggers and fallback links if an unrecognized city is queried or network fails.

---

## API Integration Architecture

The application strictly connects to public Open-Meteo REST endpoints (no API keys, no billing, no secrets):

1. **Geocoding API (City Search to Coordinates)**:
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Parameters: `name={cityName}&count=1&language=en&format=json`
   - Response Extraction: Extracts `name`, `country`, `latitude`, `longitude`, and `admin1` from `results[0]`.

2. **Forecast API (Weather Metrics)**:
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Parameters: `latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`
   - Metrics Extracted:
     - Current: Temperature (°C), Wind Speed (km/h), Weather Code, Is Day, Local Time.
     - Daily: 7-day array of dates, maximum temperatures, minimum temperatures, WMO weather codes, and precipitation totals (mm).

---

## Project Structure

```text
├── public/
│   └── _redirects              # Cloudflare Pages SPA 200 rewrite rule
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx      # Real-time conditions & metrics
│   │   ├── ErrorBanner.tsx             # Graceful error state banner
│   │   ├── ForecastGrid.tsx            # 7-Day responsive cards with spectrum bars
│   │   ├── LoadingSkeleton.tsx         # Skeleton loading states
│   │   ├── RecommendationsPanel.tsx    # Contextual smart planning heuristics
│   │   ├── SearchHeader.tsx            # Wordmark, search input & presets
│   │   ├── TemperatureTrendChart.tsx   # Interactive SVG high/low curves
│   │   └── WeatherIcon.tsx             # Dynamic Lucide icon condition resolver
│   ├── services/
│   │   └── weatherApi.ts               # Open-Meteo REST client & heuristic engine
│   ├── types/
│   │   └── weather.ts                  # TypeScript schemas and data contracts
│   ├── App.tsx                         # Primary dashboard state and lifecycle
│   ├── index.css                       # Tailwind CSS styling
│   └── main.tsx                        # Application DOM mount
├── index.html                          # Entry HTML with meta & open-graph tags
├── metadata.json                       # Applet configuration
├── package.json                        # Scripts and dependencies
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite build configuration (outDir: dist)
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm / yarn

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/mghatakTA/mouli.ghatak-weather-intelligence-l2.git
   cd mouli.ghatak-weather-intelligence-l2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Validate types and run production build:
   ```bash
   npm run build
   ```

---

## Cloudflare Pages Deployment

This project is pre-configured for automated continuous deployment to **Cloudflare Pages** via GitHub:

1. **SPA Routing Rewrite Rule**:
   - The file `public/_redirects` contains:
     ```text
     /* /index.html 200
     ```
     This ensures that deep links or page refreshes resolve cleanly to `index.html` without 404 errors.

2. **Cloudflare Pages Build Settings**:
   - **Framework preset**: Vite / None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - **Environment Variables**: `NODE_VERSION` set to `18` or `20` (optional, default works).

3. When code is pushed to your GitHub repository `https://github.com/mghatakTA/mouli.ghatak-weather-intelligence-l2`, Cloudflare Pages will automatically trigger a build and publish the live production SPA.
