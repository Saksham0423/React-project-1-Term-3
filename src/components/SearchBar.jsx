/* ===================================================================
   SearchBar.jsx — City Search Input Component
   ===================================================================
   LEARNING COMMENT:
   This is a **presentational / controlled component**.

   KEY CONCEPTS:
   ─────────────
   1. CONTROLLED INPUT
      The <input>'s value is driven by the `query` prop (which comes
      from App's state). Every keystroke calls `setQuery`, which
      updates the state, which re-renders the input with the new
      value. React is always the "source of truth" for the value.

   2. PROPS
      Props are READ-ONLY data that a parent passes down.
      This component receives:
        • query     — the current search text (string)
        • setQuery  — state setter to update the text (function)
        • onSearch  — callback to trigger a search (function)
        • loading   — whether a fetch is in progress (boolean)

   3. FORM onSubmit
      Wrapping the input in a <form> lets the user press Enter to
      submit. We call e.preventDefault() to stop the browser from
      doing a full page reload (default HTML form behaviour).
   =================================================================== */

/*
   LEARNING:
   In React, a component is just a function that returns JSX.
   The function receives a single argument: an object of props.
   We use destructuring { query, setQuery, ... } to pull out
   individual props — it's the same as writing:
     const query = props.query;
     const setQuery = props.setQuery;
*/
function SearchBar({ query, setQuery, onSearch, loading }) {
  /*
     LEARNING: handleSubmit is called when the form is submitted
     (either by pressing Enter or clicking the button).

     e.preventDefault() → stops the browser from reloading the page.
     query.trim()       → removes whitespace so "" doesn't trigger a fetch.
  */
  const handleSubmit = (e) => {
    e.preventDefault();            // Prevent full-page reload
    if (query.trim()) {            // Only search if there's text
      onSearch(query.trim());      // Call the parent's search function
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {/*
         LEARNING: CONTROLLED INPUT
         ─────────────────────────────
         • value={query}         → React controls what text is shown
         • onChange={e => ...}   → Every keystroke updates React state
         • The `e.target.value` is the new text after each keystroke

         This two-way binding (state → input, input → state) is what
         React calls a "controlled component".
      */}
      <input
        id="city-search-input"
        className="search-bar__input"
        type="text"
        placeholder="Search a city… e.g. Tokyo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="City name"
        autoComplete="off"
      />

      {/*
         LEARNING:
         • disabled={loading} → prevents the user from spamming
           requests while one is already in progress.
         • The button type is implicitly "submit" inside a <form>,
           so clicking it triggers handleSubmit.
      */}
      <button
        id="search-button"
        className="search-bar__btn"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Searching…' : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Search
          </>
        )}
      </button>
    </form>
  );
}

export default SearchBar;
