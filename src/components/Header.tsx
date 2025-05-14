import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  // Track scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Simulate navigation
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveLink(path);
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <header className={`app-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo with animated lightning symbol */}
        <div className="app-logo">
          <div className="logo-symbol">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="logo-icon"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
                className="lightning-path"
              />
            </svg>
          </div>
          <h1 className="app-title">
            Live<span className="title-accent">Wire</span>
          </h1>
        </div>
        
        {/* Mobile menu button with animated hamburger */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="main-navigation"
        >
          <div className={`hamburger ${menuOpen ? 'is-active' : ''}`}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </button>
        
        <nav className={`main-nav ${menuOpen ? 'menu-open' : ''}`} id="main-navigation">
          <ul>
            <li>
              <a 
                href="/" 
                className={activeLink === '/' ? 'nav-active' : ''}
                aria-current={activeLink === '/' ? 'page' : undefined}
                onClick={(e) => handleNavClick('/', e)}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="/categories/technology" 
                className={activeLink === '/categories/technology' ? 'nav-active' : ''}
                aria-current={activeLink === '/categories/technology' ? 'page' : undefined}
                onClick={(e) => handleNavClick('/categories/technology', e)}
              >
                Technology
              </a>
            </li>
            <li>
              <a 
                href="/categories/business" 
                className={activeLink === '/categories/business' ? 'nav-active' : ''}
                aria-current={activeLink === '/categories/business' ? 'page' : undefined}
                onClick={(e) => handleNavClick('/categories/business', e)}
              >
                Business
              </a>
            </li>
            <li>
              <a 
                href="/categories/sports" 
                className={activeLink === '/categories/sports' ? 'nav-active' : ''}
                aria-current={activeLink === '/categories/sports' ? 'page' : undefined}
                onClick={(e) => handleNavClick('/categories/sports', e)}
              >
                Sports
              </a>
            </li>
            <li>
              <a 
                href="/categories/entertainment" 
                className={activeLink === '/categories/entertainment' ? 'nav-active' : ''}
                aria-current={activeLink === '/categories/entertainment' ? 'page' : undefined}
                onClick={(e) => handleNavClick('/categories/entertainment', e)}
              >
                Entertainment
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="user-controls">
          <button className="btn btn-primary sign-in-button">
            <span className="btn-text">Sign In</span>
            <span className="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      {/* Animated gradient accent line */}
      <div className="header-accent-line"></div>
    </header>
  );
};

export default Header;
