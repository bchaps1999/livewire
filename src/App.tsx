import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './AppRoutes';
import MobileHeader from './components/MobileHeader';
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

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode: boolean) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="relative h-screen flex overflow-x-hidden bg-paper-50 dark:bg-ink-900 text-gray-800 dark:text-paper-200">
        {/* Mobile Header - visible only on small screens */}
        <MobileHeader 
          darkMode={darkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />

        <Sidebar 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <main className="flex-1 flex flex-col bg-paper-50 dark:bg-ink-900 overflow-y-auto pt-16 md:pt-0">
          <AppRoutes />
        </main>
        <aside className="hidden md:sticky md:top-0 md:h-screen md:bg-paper-50 md:dark:bg-ink-900 md:w-80 md:flex-shrink-0 md:border-l md:border-paper-200 md:dark:border-ink-700" />
      </div>
    </Router>
  );
};

export default App;
