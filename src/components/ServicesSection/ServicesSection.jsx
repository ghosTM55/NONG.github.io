import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Professional Filming',
      description: 'High-quality video production with professional equipment and experienced crew. We specialize in capturing authentic moments with cinematic quality.',
      icon: '🎥'
    },
    {
      id: 2,
      title: 'AI-Enhanced Editing',
      description: 'Cutting-edge AI technologies to enhance the post-production process, including intelligent color grading, automated scene selection, and enhanced visual effects.',
      icon: '🧠'
    },
    {
      id: 3,
      title: 'Documentary Production',
      description: 'Compelling storytelling through traditional documentary techniques enhanced by AI. We craft narratives that inform, inspire, and captivate audiences.',
      icon: '📽️'
    },
    {
      id: 4,
      title: 'Neural Visual Effects',
      description: 'Advanced neural network-powered visual effects that create stunning imagery while maintaining the authentic feel of traditional filmmaking.',
      icon: '✨'
    },
    {
      id: 5,
      title: 'Smart Content Analysis',
      description: 'AI-driven content analysis to identify key moments, optimize pacing, and enhance storytelling efficiency in the editing process.',
      icon: '📊'
    },
    {
      id: 6,
      title: 'Custom Film Solutions',
      description: 'Tailored filming solutions for specific projects and needs, combining traditional expertise with innovative AI approaches.',
      icon: '🎬'
    }
  ];

  return (
    <section id="services" className="services-section section">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        
        <p className="services-intro">
          At NONG Studio, we offer a comprehensive range of professional filming services enhanced by cutting-edge AI technologies. Our unique approach combines traditional filmmaking expertise with innovative neural processing to deliver exceptional visual storytelling.
        </p>
        
        <div className="services-grid">
          {services.map(service => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-hover-effect"></div>
            </div>
          ))}
        </div>
        
        <div className="services-cta">
          <p>Looking for a custom solution for your project?</p>
          <a href="mailto:contact@nong.studio?subject=NONG%20Studio%20business%20inquiry" className="btn btn-primary">Get In Touch</a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;