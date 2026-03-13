/* ===================================================================
   main.jsx — React Application Entry Point
   ===================================================================
   LEARNING COMMENT:
   This is the very first JavaScript file that runs. Vite's index.html
   has a <script> tag pointing here. Its only job is to:
     1. Import global styles (index.css)
     2. Import the root <App /> component
     3. Tell React to render <App /> inside the DOM element with id="root"

   KEY CONCEPTS:
   • React.StrictMode — A wrapper that enables extra development-only
     checks (like warning if you forget cleanup in useEffect).
   • ReactDOM.createRoot() — The modern React 18 API for mounting the
     React tree into the real DOM.
   =================================================================== */

import { StrictMode } from 'react';          // React's strict-mode wrapper
import { createRoot } from 'react-dom/client'; // Modern mounting API
import './index.css';                          // Global design tokens & reset
import App from './App.jsx';                   // Root component

/*
   LEARNING:
   document.getElementById('root') grabs the <div id="root"> from
   index.html. createRoot() turns it into a React root, and .render()
   tells React what JSX tree to paint inside it.
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
