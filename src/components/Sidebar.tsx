import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SineWaveLogo from './SineWaveLogo'; // Import the logo
// Removed getChannels import, will define channels locally for this example

interface UserData {
  // Define based on the actual structure of your userData from Cognito
  // Example fields:
  username?: string;
  email?: string;
  name?: string;
  sub?: string;
  preferred_username?: string;
}

// Changed from Channel to TagFilter
interface TagFilter {
  id: string;
  name: string;
  slug: string; // This will be the tag value for the query parameter
  icon: JSX.Element;
}

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

// Helper function to get and parse cookie
const getCookieValue = (name: string): UserData | null => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      try {
        const decodedValue = atob(cookieValue); // Decode Base64
        return JSON.parse(decodedValue) as UserData; // Parse JSON
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        return null;
      }
    }
  }
  return null;
};

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode, isMobileMenuOpen, toggleMobileMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const location = useLocation(); // Get location object

  useEffect(() => {
    const user = getCookieValue('waveform_user');
    if (user) {
      setCurrentUser(user);
    }
    // Listen for custom event that might be dispatched after login/logout from other parts of the app
    // or when cookies are set by an external process (like the /auth/callback redirect)
    const handleAuthChange = () => {
      const updatedUser = getCookieValue('waveform_user');
      setCurrentUser(updatedUser);
    };

    window.addEventListener('authChange', handleAuthChange);
    // Also check on focus in case cookie was set by a different tab/window then focus returns
    window.addEventListener('focus', handleAuthChange);

    // Initial check in case the event was missed (e.g. page load after redirect)
    handleAuthChange(); 

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, []);

  // Updated channels to be tag filters
  const tagFilters: TagFilter[] = [
    {
      id: 'politics',
      name: 'Politics',
      slug: 'politics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 10.5A.5.5 0 0 1 15 10h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M2 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
          <path d="M3 12v7.235A.765.765 0 0 0 3.765 20h16.47A.765.765 0 0 0 21 19.235V12M5 12.5V20M19 12.5V20M12 12.5V20"/>
        </svg>
      )
    },
    {
      id: 'economics',
      name: 'Economics',
      slug: 'economics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      id: 'science',
      name: 'Science',
      slug: 'science',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M12 2.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5zm0 16a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/>
         <path d="M12 6v2m0 8v2m-5.7-5.7l1.4 1.4m8.6 5.2l1.4 1.4m-10-7.2L6.7 12m10.6 0l-1.4-1.4m-5.2-8.6L12 6.7m0 10.6l-1.4 1.4"/>
        </svg>
      )
    },
    {
      id: 'technology',
      name: 'Technology',
      slug: 'technology',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path>
        </svg>
      )
    },
    {
      id: 'sports',
      name: 'Sports',
      slug: 'sports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12.89 1.45.64-.63a2 2 0 0 1 2.82 0l4.25 4.24a2 2 0 0 1 0 2.83l-12 12a2 2 0 0 1-2.83 0L1.45 15.6a2 2 0 0 1 0-2.83L5.7 8.51"/>
            <path d="M8.51 5.7 13 10.2"/>
            <path d="M10.2 13 15.6 18.34"/>
            <path d="m16.11 3.89.64.63"/>
            <path d="m5.01 14.99.64.63"/>
        </svg>
      )
    },
    {
      id: 'international',
      name: 'International',
      slug: 'international',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>
        </svg>
      )
    }
  ];
  
  
  return (
    <aside 
      className={`
        bg-paper-50 dark:bg-ink-900 border-r border-paper-200 dark:border-ink-700 
        flex flex-col p-6 h-screen overflow-y-auto transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40 w-72 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:sticky md:translate-x-0 md:w-80 md:flex-shrink-0 
      `}
    >
      {/* Mobile Close Button */}
      <button 
        onClick={toggleMobileMenu} 
        className="absolute top-4 right-4 p-2 md:hidden text-ink-600 dark:text-paper-300 hover:text-ink-800 dark:hover:text-paper-100"
        aria-label="Close menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Scrollable upper content area */}
      <div className="flex-grow overflow-y-auto space-y-6 mb-6 pr-2"> {/* Added pr-2 for scrollbar spacing if needed */}
        {/* Logo */}
        <div className="flex items-center">
          <SineWaveLogo darkMode={darkMode} />
          <h1 className="text-4xl font-outfit font-semibold text-ink-800 dark:text-paper-100">Waveform</h1>
        </div>
        
        {/* Main Nav */}
        <nav className="space-y-1.5">
          <NavLink 
            to="/"
            end // Important for root path matching
            className={({isActive}) => {
              const queryParams = new URLSearchParams(location.search);
              const isTagActive = queryParams.has('tag');
              return `flex items-center py-2.5 px-3 rounded-lg transition-colors text-sm ${
                isActive && !isTagActive // Only active if on "/" and no tag is selected
                  ? 'bg-green-100 dark:bg-green-700/20 text-green-700 dark:text-green-400 font-semibold' 
                  : 'text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100'
              }`;
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h4v10a2 2 0 0 0 2 2Z"/>
              <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/>
              <path d="M10 6h8"/><path d="M10 10h8"/><path d="M10 14h4"/>
            </svg>
            <span className="font-medium">Top Stories</span>
          </NavLink>
          
          <NavLink 
            to="/breaking"
            className={({isActive}) => `flex items-center py-2.5 px-3 rounded-lg transition-colors text-sm ${
              isActive 
                ? 'bg-green-100 dark:bg-green-700/20 text-green-700 dark:text-green-400 font-semibold' 
                : 'text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Breaking News</span>
          </NavLink>
        </nav>
        
        {/* Channels */}
        <div className="space-y-2 pt-4">
          <h2 className="text-xs font-mono font-semibold text-ink-500 dark:text-paper-500 uppercase tracking-wider px-3">Channels</h2>
          
          {tagFilters.map(tag => {
            const queryParams = new URLSearchParams(location.search);
            const isActive = location.pathname === '/' && queryParams.get('tag') === tag.slug;
            return (
              <NavLink 
                key={tag.id} 
                to={`/?tag=${tag.slug}`}
                className={`flex items-center py-2.5 px-3 rounded-lg transition-colors text-sm ${
                  isActive 
                    ? 'bg-green-100 dark:bg-green-700/20 text-green-700 dark:text-green-400 font-semibold' 
                    : 'text-ink-700 dark:text-paper-300 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-paper-100'
                }`}
              >
                <span className="mr-3 opacity-80">{tag.icon}</span>
                <span className="font-medium flex-grow">{tag.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div> {/* End of scrollable upper content area */}
      
      {/* Bottom utilities - This will be pushed to the bottom by the flex-grow on the div above */}
      <div className="flex-shrink-0 pt-6 space-y-1.5 border-t border-paper-200 dark:border-ink-700">
        <a href="#" className="flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            <path d="M5 3v4"></path>
            <path d="M19 17v4"></path>
            <path d="M3 5h4"></path>
            <path d="M17 19h4"></path>
          </svg>
          <span>What's New</span>
        </a>
        
        <a href="#" className="flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span>Search</span>
        </a>
        
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-left text-sm"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="M4.93 4.93l1.41 1.41"></path>
              <path d="M17.66 17.66l1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="M6.34 17.66l-1.41 1.41"></path>
              <path d="M19.07 4.93l-1.41 1.41"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          )}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        {currentUser ? (
          <>
            <div className="flex items-center py-2.5 px-3 text-ink-700 dark:text-paper-300 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{currentUser.preferred_username || currentUser.email || 'User'}</span>
            </div>
            <a
              href="/logout"
              className="flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out</span>
            </a>
          </>
        ) : (
          <a
            href="/login"
            className="flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Sign In</span>
          </a>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
