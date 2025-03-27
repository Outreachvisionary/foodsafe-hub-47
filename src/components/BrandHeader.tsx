
import React from 'react';
import { Link } from 'react-router-dom';

const BrandHeader: React.FC = () => {
  return (
    <div className="bg-cc-teal py-8 px-4 md:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          {/* SVG logo can be placed directly here */}
          <div className="h-16 mb-4 w-auto">
            {/* Option 1: If SVG is uploaded as a file */}
            {/* <img src="/path/to/your/logo.svg" alt="Compliance Core Logo" className="h-full w-auto" /> */}
            
            {/* Option 2: Inline SVG for better control */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 240 80" 
              className="h-full w-auto"
              aria-labelledby="compliance-core-logo-title"
            >
              <title id="compliance-core-logo-title">Compliance Core Logo</title>
              {/* Example SVG content - replace with your actual SVG paths */}
              <path 
                d="M40,20 L200,20 L200,60 L40,60 Z" 
                fill="#C6A256" /* This uses the gold color from your theme */
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* Additional SVG paths would go here */}
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display text-white font-bold mb-3">
            COMPLIANCE <span className="text-cc-gold">CORE</span>
          </h1>
          <p className="text-cc-tagline font-display tracking-widest uppercase text-lg">
            WHERE COMPLIANCE MEETS CONFIDENCE
          </p>
        </div>
        
        <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
          Streamline your food safety compliance with our comprehensive platform designed for modern enterprises.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="bg-transparent border-2 border-cc-gold text-cc-gold hover:bg-cc-gold/10 px-6 py-3 rounded-md font-display uppercase tracking-wider">
            Sign In
          </Link>
          <Link to="/demo" className="bg-cc-gold text-cc-teal hover:bg-cc-gold/90 px-6 py-3 rounded-md font-display uppercase tracking-wider">
            Request Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandHeader;
