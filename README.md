# Nong Studio Website

A professional website for Nong Studio, a filming studio that integrates AI technologies into traditional documentary and video production.

## Project Overview

Nong Studio represents a new frontier in filmmaking, where traditional documentary techniques meet cutting-edge AI technologies. The name NONG stands for "Native Optics Neural Grain" - embodying our commitment to preserving the organic, human essence of storytelling while enhancing it with neural network technologies.

This website serves as a landing page to introduce Nong Studio, its mission, services, and provide a way for potential clients to get in touch.

## Features

- Responsive design that works across all device sizes
- Modern, creative aesthetic with unique visual elements
- Smooth animations and transitions for enhanced user experience
- Contact form with validation
- Optimized for search engines and social sharing

## Technology Stack

- **Framework**: React.js
- **Styling**: CSS with custom variables for consistent design
- **Deployment**: GitHub Pages
- **Domain**: Custom domain (nong.studio)

## Project Structure

```
nong-studio/
├── public/                 # Static assets
│   ├── favicon.svg        # Site favicon
│   ├── logo.svg           # Nong Studio logo
│   ├── og-image.svg       # Open Graph image for social sharing
│   ├── CNAME              # Custom domain configuration
│   ├── sitemap.xml        # Site map for SEO
│   ├── robots.txt         # Robots configuration
│   ├── manifest.json      # Web app manifest
│   └── index.html         # HTML template
│
├── src/                    # Source code
│   ├── components/        # React components
│   │   ├── Header/        # Site header and navigation
│   │   ├── Footer/        # Site footer
│   │   ├── HeroSection/   # Hero section with logo and slogan
│   │   ├── AboutSection/  # About section with mission and values
│   │   ├── ServicesSection/ # Services offered by the studio
│   │   └── ContactSection/ # Contact form and information
│   │
│   ├── styles/            # Global styles
│   │   ├── variables.css  # CSS variables for design system
│   │   └── global.css     # Global styles and utilities
│   │
│   ├── assets/            # Assets used in the application
│   │   └── images/        # Image assets
│   │
│   ├── App.js             # Main application component
│   ├── App.css            # Application-specific styles
│   ├── index.js           # Application entry point
│   └── index.css          # Entry point styles
│
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nong-studio.git
   cd nong-studio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Deployment

The website is configured to deploy to GitHub Pages. To deploy:

1. Update the `homepage` field in `package.json` with your GitHub Pages URL or custom domain.

2. Run the deploy script:
   ```
   npm run deploy
   ```

## Future Enhancements

- Portfolio/Demo section to showcase completed projects
- Blog or news section for updates
- Team member profiles
- More detailed information about AI integration in filmmaking

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries about this project, please contact:
- Email: info@nong.studio
