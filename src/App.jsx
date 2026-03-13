/* ===================================================================
   App.jsx — Root Component (state lives here)
   ===================================================================
   LEARNING COMMENT:
   This is the **root component**. It owns all the important state for
   the app and passes data + callbacks down to child components via
   **props**. This pattern is called "lifting state up" — the parent
   manages state so siblings can share it.

   STATE OVERVIEW (all declared with useState):
   ┌────────────────┬───────────────────────────────────────────────┐
   │ State variable  │ Purpose                                      │
   ├────────────────┼───────────────────────────────────────────────┤
   │ query          │ Current text in the search input              │
   │ weatherData    │ Object returned by the API (or null)          │
   │ loading        │ true while the fetch is in progress           │
   │ error          │ Error message string (or null)                │
   │ unit           │ 'C' or 'F' — which temperature unit to show   │
   │ recentCities   │ Array of recently searched city names          │
   └────────────────┴───────────────────────────────────────────────┘

   KEY REACT CONCEPTS USED:
   • useState   — Declare reactive state variables
   • useEffect  — Run side-effects (here: load recentCities from
                  localStorage when the component first mounts)
   • useCallback — Memoise a function so it doesn't re-create on
                   every render (performance optimisation)
   • Conditional rendering — Show different UI depending on state
   =================================================================== */

import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

// Child components — each handles one visual piece of the UI
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import UnitToggle from './components/UnitToggle';
import RecentSearches from './components/RecentSearches';

/*
   LEARNING:
   import.meta.env.VITE_OWM_API_KEY reads the value from the .env
   file.  Vite only exposes variables that start with VITE_ to the
   client code — this is a security measure so you don't accidentally
   leak server-only secrets.
*/
const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  /* ----- State declarations ----- */

  // The text the user is currently typing in the search box.
  // "Controlled input" means React owns the value, not the DOM.
  const [query, setQuery] = useState('');

  // Holds the parsed JSON from the API once a successful fetch completes.
  const [weatherData, setWeatherData] = useState(null);

  // Boolean flag: true while we're waiting for the API response.
  const [loading, setLoading] = useState(false);

  // If something goes wrong (network error, city not found), we store
  // a user-friendly message here.
  const [error, setError] = useState(null);

  // Temperature unit — 'C' for Celsius, 'F' for Fahrenheit.
  const [unit, setUnit] = useState('C');

  // An array of the last 5 city names the user searched for.
  // Persisted to localStorage so it survives page reloads.
  const [recentCities, setRecentCities] = useState([]);

  /* ----- Load recent cities from localStorage on mount ----- */
  /*
     LEARNING: useEffect with an EMPTY dependency array [] runs exactly
     ONCE — right after the component mounts.  This is the standard
     pattern for "do something when the component first appears".

     We use JSON.parse to convert the stored string back into a JS array.
     If there's nothing stored, we fall back to an empty array.
  */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentCities');
      if (stored) {
        setRecentCities(JSON.parse(stored));
      }
    } catch {
      // If localStorage is corrupted, just start fresh
      console.warn('Could not read recentCities from localStorage');
    }
  }, []); // ← empty array = run once on mount

  /* ----- Helper: save a city into the recent list ----- */
  /*
     LEARNING: We keep only the last 5 unique cities by:
     1. Filtering out duplicates (case-insensitive)
     2. Prepending the new city
     3. Slicing to 5 items max
     Then we save to both React state AND localStorage.
  */
  const saveToRecent = useCallback((cityName) => {
    setRecentCities((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      const updated = [cityName, ...filtered].slice(0, 5);

      // Persist to localStorage for next visit
      localStorage.setItem('recentCities', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* ----- Core: fetch weather data from OpenWeatherMap ----- */
  /*
     LEARNING: useCallback memoises the function reference, preventing
     unnecessary re-creations. The dependency array [saveToRecent]
     tells React to re-create this function ONLY if saveToRecent
     changes (which it won't, because saveToRecent is also memoised).

     KEY FETCH CONCEPTS:
     • We pass `units=metric` so the API returns Celsius by default.
       We convert to Fahrenheit on the client side when unit === 'F'.
     • The `response.ok` check catches HTTP errors (e.g., 404 for
       unknown cities).
     • We wrap everything in try/catch so network failures are handled.
  */
  const fetchWeather = useCallback(async (cityName) => {
    // Don't fetch if there's no city or no API key
    if (!cityName.trim()) return;

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please add your OpenWeatherMap API key in the .env file.');
      return;
    }

    // Reset previous results & start loading
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      /*
         LEARNING: Template literals (`backtick strings`) let us embed
         variables with ${…}. encodeURIComponent() makes the city name
         URL-safe (handles spaces, special chars).
      */
      const url = `${BASE_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;

      /*
         LEARNING: fetch() returns a Promise. `await` pauses execution
         until the Promise resolves, making async code read like
         synchronous code.
      */
      const response = await fetch(url);

      // If the HTTP status isn't 2xx, treat it as an error
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${cityName}" not found. Please check the spelling.`);
        }
        throw new Error('Something went wrong. Please try again.');
      }

      const data = await response.json();

      /*
         LEARNING: We store only the fields we need, not the entire
         raw API response. This keeps our state predictable and makes
         the WeatherCard component simpler.
      */
      setWeatherData({
        city: data.name,
        country: data.sys.country,
        tempCelsius: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        weatherMain: data.weather[0].main, // e.g. "Clear", "Clouds", "Rain"
      });

      // Add to recent searches
      saveToRecent(data.name);
    } catch (err) {
      /*
         LEARNING: The catch block runs if ANY error occurs inside try:
         network failure, JSON parse error, or our own thrown errors.
         We store the message in state so the UI can display it.
      */
      setError(err.message);
    } finally {
      /*
         LEARNING: `finally` runs REGARDLESS of success or failure.
         It's the ideal place to turn off the loading spinner.
      */
      setLoading(false);
    }
  }, [saveToRecent]);

  /* ----- Event handler: user submits the search form ----- */
  /*
     LEARNING: We separate the "handle submit" logic from the "fetch"
     logic.  handleSearch is called by the SearchBar component when the
     form is submitted. It calls fetchWeather and clears the input.
  */
  const handleSearch = useCallback((searchTerm) => {
    fetchWeather(searchTerm);
    setQuery('');  // Clear the input after searching
  }, [fetchWeather]);

  /* ----- Event handler: user clicks a recent city ----- */
  const handleRecentClick = useCallback((cityName) => {
    fetchWeather(cityName);
  }, [fetchWeather]);

  /* ----- Derive background colour from weather condition ----- */
  /*
     LEARNING: useMemo caches a computed value so it only recalculates
     when one of its dependencies changes. Here we derive a subtle
     background colour based on the current weather condition.
  */
  const weatherBg = useMemo(() => {
    if (!weatherData) return undefined;
    const conditionMap = {
      Clear:        'radial-gradient(ellipse at 50% 80%, #1a1a00 0%, #000000 70%)',
      Clouds:       'radial-gradient(ellipse at 50% 80%, #111118 0%, #000000 70%)',
      Rain:         'radial-gradient(ellipse at 50% 80%, #0a0a1a 0%, #000000 70%)',
      Drizzle:      'radial-gradient(ellipse at 50% 80%, #0a0f1a 0%, #000000 70%)',
      Thunderstorm: 'radial-gradient(ellipse at 50% 80%, #12091a 0%, #000000 70%)',
      Snow:         'radial-gradient(ellipse at 50% 80%, #0f1318 0%, #000000 70%)',
      Mist:         'radial-gradient(ellipse at 50% 80%, #101214 0%, #000000 70%)',
      Haze:         'radial-gradient(ellipse at 50% 80%, #14120e 0%, #000000 70%)',
      Fog:          'radial-gradient(ellipse at 50% 80%, #101214 0%, #000000 70%)',
      Smoke:        'radial-gradient(ellipse at 50% 80%, #121210 0%, #000000 70%)',
    };
    return conditionMap[weatherData.weatherMain] || undefined;
  }, [weatherData]);

  /* ----- Get a readable timestamp ----- */
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* ----- Render ----- */
  /*
     LEARNING: JSX lets you write HTML-like syntax inside JavaScript.
     Under the hood React.createElement() calls are generated.

     CONDITIONAL RENDERING:
     • {loading && <Loading />}  — Renders the loading UI only when
       `loading` is true. This uses JavaScript's short-circuit evaluation.
     • {error && <Error />}      — Same idea for errors.
     • {weatherData && <Card />} — Shows the card only when data exists.
  */
  return (
    <div className="app" style={weatherBg ? { background: weatherBg } : undefined}>
      {/* ---- Header ---- */}
      <header className="app__header">
        <p className="app__date">{currentDate}</p>
        <h1 className="app__title">Weather Checker</h1>
        <p className="app__subtitle">Search any city for live weather</p>
      </header>

      {/* ---- Search Input ---- */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* ---- Unit Toggle (°C / °F) ---- */}
      <UnitToggle unit={unit} setUnit={setUnit} />

      {/* ---- Loading Spinner ---- */}
      {loading && (
        <div className="loading">
          <div className="loading__spinner" />
          <p className="loading__text">Fetching weather data…</p>
        </div>
      )}

      {/* ---- Error Message ---- */}
      {error && (
        <div className="error" role="alert">
          <span className="error__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </span>
          <span>{error}</span>
        </div>
      )}

      {/* ---- Weather Data Card ---- */}
      {weatherData && !loading && (
        <WeatherCard data={weatherData} unit={unit} />
      )}

      {/* ---- Recent Searches ---- */}
      {recentCities.length > 0 && (
        <RecentSearches
          cities={recentCities}
          onCityClick={handleRecentClick}
        />
      )}
    </div>
  );
}

/*
   LEARNING: `export default` makes this component importable in other
   files with:  import App from './App';
*/
export default App;
