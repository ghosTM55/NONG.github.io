import React, { useEffect, useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add animation class after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className={`hero-content ${isLoaded ? 'fade-in' : ''}`}>
          <h1 className="hero-title">NONG STUDIO</h1>
          <p className="hero-slogan">Native Optics Neural Grain</p>
          <p className="hero-description">
            Professional filming studio merging traditional documentary techniques with cutting-edge AI technologies
          </p>
          <div className="hero-cta">
            <a href="mailto:contact@nong.studio?subject=NONG%20Studio%20business%20inquiry" className="btn btn-primary">Get In Touch</a>
            <a href="#services" className="btn btn-secondary">Our Services</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;