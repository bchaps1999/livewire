import React from 'react';
import SineWaveLogo from './SineWaveLogo';

interface MobileHeaderProps {
  darkMode: boolean;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ darkMode, isMobileMenuOpen, toggleMobileMenu }) => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 h-16 bg-paper-50 dark:bg-ink-900 border-b border-paper-200 dark:border-ink-700">
      <div className="flex items-center">
        <SineWaveLogo darkMode={darkMode} />
        <h1 className="text-2xl font-outfit font-semibold text-ink-800 dark:text-paper-100 ml-2">Waveform</h1>
      </div>
      <button
        className="p-2 rounded-md text-ink-700 dark:text-paper-200"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>
    </header>
  );
};

export default MobileHeader; 