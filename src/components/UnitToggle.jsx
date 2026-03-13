/* ===================================================================
   UnitToggle.jsx — °C / °F Temperature Unit Switcher
   ===================================================================
   LEARNING COMMENT:
   This is a very small, focused component. It demonstrates:

   KEY CONCEPTS:
   ─────────────
   1. DYNAMIC CLASS NAMES
      We add the "--active" modifier class to whichever button matches
      the current `unit` state. This is a common pattern:
        className={`base ${condition ? 'modifier' : ''}`}

   2. LIFTING STATE UP
      This component does NOT own the `unit` state — the parent (App)
      does, and passes it down via props. When the user clicks a
      button, we call `setUnit('C')` or `setUnit('F')`, which updates
      the parent's state and triggers a re-render of every component
      that depends on `unit` (including WeatherCard).

   PROPS:
   • unit    — 'C' or 'F' (current selection)
   • setUnit — function to update the unit in the parent
   =================================================================== */

function UnitToggle({ unit, setUnit }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {/*
         LEARNING: DYNAMIC CLASS NAMES
         ─────────────────────────────
         Template literal trick:
           `unit-toggle__btn ${unit === 'C' ? 'unit-toggle__btn--active' : ''}`

         If unit is 'C', the full className becomes:
           "unit-toggle__btn unit-toggle__btn--active"
         Otherwise:
           "unit-toggle__btn"

         The CSS uses the --active class to apply the gradient background.
      */}
      <button
        id="unit-celsius"
        className={`unit-toggle__btn ${unit === 'C' ? 'unit-toggle__btn--active' : ''}`}
        onClick={() => setUnit('C')}
        aria-pressed={unit === 'C'}
      >
        °C
      </button>

      <button
        id="unit-fahrenheit"
        className={`unit-toggle__btn ${unit === 'F' ? 'unit-toggle__btn--active' : ''}`}
        onClick={() => setUnit('F')}
        aria-pressed={unit === 'F'}
      >
        °F
      </button>
    </div>
  );
}

export default UnitToggle;
