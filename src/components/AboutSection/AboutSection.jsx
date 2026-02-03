import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section id="about" className="about-section section">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-intro">
              <span className="highlight">NONG STUDIO</span> represents a new frontier in filmmaking, where traditional documentary techniques meet cutting-edge AI technologies.
            </p>
            
            <p>
              Founded by passionate filmmakers with a vision to revolutionize visual storytelling, we combine the authenticity of traditional documentary filmmaking with the innovative capabilities of artificial intelligence.
            </p>
            
            <p>
              Our name, NONG, stands for <span className="highlight">Native Optics Neural Grain</span> - embodying our commitment to preserving the organic, human essence of storytelling while enhancing it with neural network technologies.
            </p>
            
            <p>
              We believe that AI should not replace human creativity but amplify it. Our approach integrates advanced technologies into the filmmaking process to enhance efficiency, expand creative possibilities, and deliver exceptional visual experiences.
            </p>
            
            <div className="about-values">
              <div className="value-item">
                <h3>Vision</h3>
                <p>To pioneer a new era of filmmaking where technology and human creativity coexist harmoniously.</p>
              </div>
              
              <div className="value-item">
                <h3>Mission</h3>
                <p>To create compelling visual stories that resonate with audiences while pushing the boundaries of what's possible in film production.</p>
              </div>
              
              <div className="value-item">
                <h3>Values</h3>
                <p>Authenticity, innovation, artistic integrity, and technological excellence guide everything we do.</p>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <div className="image-container">
              {/* Placeholder for studio image */}
              <div className="image-placeholder">
                <div className="placeholder-text">NONG STUDIO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;