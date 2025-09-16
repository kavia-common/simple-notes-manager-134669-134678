import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import NotesPage from './pages/NotesPage';
import { NotesProvider } from './context/NotesContext';

/**
 * Root App component for Notes Manager.
 * Provides light/dark theme toggle and renders NotesPage inside NotesProvider.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const themeLabel = theme === 'light' ? '🌙 Dark' : '☀️ Light';
  const themeAria = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;

  const providerValue = useMemo(() => ({}), []);

  return (
    <div className="App">
      <header className="app-header-shell">
        <nav className="navbar">
          <div className="navbar-left">
            <span className="brand">Notes</span>
          </div>
          <div className="navbar-right">
            <button className="btn" onClick={toggleTheme} aria-label={themeAria}>
              {themeLabel}
            </button>
          </div>
        </nav>
      </header>

      <main className="app-main">
        <NotesProvider value={providerValue}>
          <NotesPage />
        </NotesProvider>
      </main>

      <footer className="app-footer">
        <small>Simple Notes Manager</small>
      </footer>
    </div>
  );
}

export default App;
