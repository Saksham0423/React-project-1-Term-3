/* ===================================================================
   WeatherCard.jsx — Displays weather data for a city
   ===================================================================
   LEARNING COMMENT:
   This component takes in weather data and the selected temperature
   unit, then renders a pretty card.

   KEY CONCEPTS:
   ─────────────
   1. DERIVED / COMPUTED VALUES
      We don't store the Fahrenheit temperature in state. Instead we
      compute it from the Celsius value on each render. This is a
      best practice — avoid redundant state that can go out of sync.

   2. CONDITIONAL RENDERING
      We render different content depending on what props we receive.

   3. TEMPLATE LITERALS
      Used to build the icon URL dynamically from the icon code.

   PROPS:
   • data — object { city, country, tempCelsius, feelsLike,
            humidity, windSpeed, condition, icon }
   • unit — 'C' or 'F'
   =================================================================== */

function WeatherCard({ data, unit }) {
  /*
     LEARNING: DERIVED STATE
     ───────────────────────
     Rather than storing both Celsius and Fahrenheit in state (which
     would be "redundant state"), we compute the display temperature
     on every render. The formula for C → F is:  F = C × 9/5 + 32.

     toFixed(1) rounds to 1 decimal place and returns a string.
  */
  const displayTemp = unit === 'C'
    ? `${data.tempCelsius.toFixed(1)}°C`
    : `${(data.tempCelsius * 9 / 5 + 32).toFixed(1)}°F`;

  const displayFeelsLike = unit === 'C'
    ? `${data.feelsLike.toFixed(1)}°C`
    : `${(data.feelsLike * 9 / 5 + 32).toFixed(1)}°F`;

  /*
     LEARNING:
     OpenWeatherMap provides icon codes (e.g. "01d" for clear sky day).
     We build the full image URL from this code. The @2x suffix gives
     us a higher-resolution (retina) version of the icon.
  */
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div className="weather-card" id="weather-card">
      {/* Weather icon — fetched from OpenWeatherMap's CDN */}
      <img
        className="weather-card__icon"
        src={iconUrl}
        alt={data.condition}
      />

      {/* City name and country code */}
      <h2 className="weather-card__city">
        {data.city}, {data.country}
      </h2>

      {/* Main temperature — uses the gradient text effect from CSS */}
      <p className="weather-card__temp">{displayTemp}</p>

      {/* Weather description (e.g. "broken clouds") */}
      <p className="weather-card__condition">{data.condition}</p>

      {/*
         LEARNING: Extra details section
         We show three small stats in a flex row.  Each one is
         structured identically — a label on top and a value below.
      */}
      <div className="weather-card__details">
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Feels Like</span>
          <span className="weather-card__detail-value">{displayFeelsLike}</span>
        </div>

        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Humidity</span>
          <span className="weather-card__detail-value">{data.humidity}%</span>
        </div>

        <div className="weather-card__detail">
          <span className="weather-card__detail-label">Wind</span>
          <span className="weather-card__detail-value">{data.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
