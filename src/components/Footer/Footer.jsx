import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3 className="footer-logo-text">NONG Studio</h3>
            <p className="footer-tagline">Native Optics Neural Grain</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="mailto:contact@nong.studio?subject=NONG%20Studio%20business%20inquiry">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:contact@nong.studio?subject=NONG%20Studio%20business%20inquiry">contact@nong.studio</a></li>
                <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Social</h4>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="social-icon">Instagram</i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="social-icon">Twitter</i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="social-icon">LinkedIn</i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} NONG Studio. All rights reserved.
          </p>
          <p className="footer-legal">
            <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;