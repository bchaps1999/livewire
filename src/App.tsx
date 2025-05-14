import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './AppRoutes';
// Remove redundant style imports
// import './styles/animations.css'; 
// import './styles/styles.css'; 
// import './styles/feed.css';
// All styles are now imported from main.css in the entry point

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode: boolean) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`h-screen flex overflow-hidden bg-gray-100 dark:bg-ink-900 text-gray-800 dark:text-paper-200`}>
        <Sidebar 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        {/* Main content area */}
        <main className="flex-1 bg-grey-100 dark:bg-ink-900 overflow-y-auto p-4">
          <AppRoutes />
          
          {/* Add chat input at the bottom similar to sample */}
          {/* Removed the chat input box */}
        </main>
      </div>
    </Router>
  );
};

export default App;
