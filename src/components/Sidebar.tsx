import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Removed getChannels import, will define channels locally for this example

interface Channel {
  id: string;
  name: string;
  slug: string;
  icon: JSX.Element;
  articleCount: number;
}

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const channels: Channel[] = [
    { 
      id: '1', 
      name: 'Tech Innovations', 
      slug: 'tech-innovations', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path>
        </svg>
      ),
      articleCount: 28
    },
    { 
      id: '2', 
      name: 'Global Markets', 
      slug: 'global-markets', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      articleCount: 15
    },
    { 
      id: '3', 
      name: 'Design & Arch', 
      slug: 'design-architecture', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      articleCount: 22
    },
    { 
      id: '4', 
      name: 'Science Today', 
      slug: 'science-today', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      ),
      articleCount: 31
    },
    { 
      id: '5', 
      name: 'Cultural Review', 
      slug: 'cultural-review', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>
        </svg>
      ),
      articleCount: 19
    }
  ];
  
  return (
    <aside className="bg-paper-50 dark:bg-ink-900 w-64 flex-shrink-0 border-r border-paper-200 dark:border-ink-700 flex flex-col overflow-y-auto transition-all duration-300 shadow-lg p-6 space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-700 dark:bg-green-600 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h1 className="text-2xl font-display font-bold text-ink-800 dark:text-paper-100">Livewire</h1>
      </div>
      
      {/* Main Nav */}
      <nav className="space-y-1.5">
        <NavLink 
          to="/"
          className={({isActive}) => `flex items-center py-2.5 px-3 rounded-lg transition-colors text-sm ${
            isActive 
              ? 'bg-green-100 dark:bg-green-700/20 text-green-700 dark:text-green-400 font-semibold' 
              : 'text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h4v10a2 2 0 0 0 2 2Z"/>
            <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/>
            <path d="M10 6h8"/>
            <path d="M10 10h8"/>
            <path d="M10 14h4"/>
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
        
        {channels.map(channel => (
          <NavLink 
            key={channel.id} 
            to={`/category/${channel.slug}`} 
            className={({isActive}) => 
              `flex items-center py-2.5 px-3 rounded-lg transition-colors text-sm ${
                isActive 
                  ? 'bg-green-100 dark:bg-green-700/20 text-green-700 dark:text-green-400 font-semibold' 
                  : 'text-ink-700 dark:text-paper-300 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-paper-100'
              }`
            }
          >
            <span className="mr-3 opacity-80">{channel.icon}</span>
            <span className="font-medium flex-grow">{channel.name}</span>
            <span className="ml-auto text-xs font-mono text-ink-400 dark:text-paper-500 bg-paper-200 dark:bg-ink-700 px-1.5 py-0.5 rounded-sm">{channel.articleCount}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Bottom utilities */}
      <div className="mt-auto pt-6 space-y-1.5 border-t border-paper-200 dark:border-ink-700">
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
        
        <a href="#" className="flex items-center py-2.5 px-3 rounded-lg text-ink-600 dark:text-paper-400 hover:bg-paper-200 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-paper-100 transition-colors text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 opacity-80">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
