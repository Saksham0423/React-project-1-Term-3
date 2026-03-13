 /*/* ===================================================================
   RecentSearches.jsx — List of Recently Searched Cities
   ===================================================================
   LEARNING COMMENT:
   This component displays a horizontal list of "pill" buttons, one
   for each recently searched city. Clicking a pill re-fetches that
   city's weather.

   KEY CONCEPTS:
   ─────────────
   1. RENDERING LISTS WITH .map()
      In React, to render an array of items, you call .map() on the
      array and return JSX for each element. React then renders each
      piece of JSX as a child.

   2. THE `key` PROP
      When rendering lists, React needs a unique `key` on each item
      so it can efficiently update the DOM when the list changes.
      Keys should be stable identifiers — here we use the city name
      since it's unique in our list.

   3. CALLBACK WITH ARGUMENTS
      onClick={() => onCityClick(city)} creates a new arrow function
      that calls onCityClick with the specific `city` value.
      Without the arrow function wrapper, the function would execute
      immediately during render — NOT what we want!

   PROPS:
   • cities      — array of city name strings, e.g. ['Tokyo','Paris']
   • onCityClick — function to call when a city pill is clicked
   =================================================================== */

function RecentSearches({ cities, onCityClick }) {
  return (
    <div className="recent" id="recent-searches">
      <h3 className="recent__title">Recent Searches</h3>

      {/*
         LEARNING: RENDERING LISTS
         ──────────────────────────
         .map() transforms each city string into a <li> element.
         React collects all the returned JSX and renders them as
         children of the <ul>.

         Example transformation:
           ['Tokyo', 'Paris']
         becomes:
           <li key="Tokyo">Tokyo</li>
           <li key="Paris">Paris</li>
      */}
      <ul className="recent__list">
        {cities.map((city) => (
          <li
            key={city}               // Unique key for React's diffing algorithm
            className="recent__item"
            onClick={() => onCityClick(city)} // Re-fetch this city's weather
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              // LEARNING: Accessibility — let keyboard users press
              // Enter or Space to activate the pill, just like a click.
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCityClick(city);
              }
            }}
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSearches;
