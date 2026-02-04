import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change header style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <a href="#hero">
              <span className="logo-text">NONG STUDIO</span>
            </a>
          </div>
          
          <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#hero" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="#services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a href="mailto:contact@nong.studio?subject=NONG%20Studio%20business%20inquiry" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;