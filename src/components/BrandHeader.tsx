
import React from 'react';
import { Link } from 'react-router-dom';

const BrandHeader: React.FC = () => {
  return (
    <div className="bg-cc-teal py-8 px-4 md:px-8 text-center object-contain">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          <img src="/lovable-uploads/98c6dceb-0bcf-4c01-a92f-ce4f884cdcff.png" alt="Compliance Core Logo" className="h-32 mb-4" />
          <h1 className="text-4xl md:text-5xl font-display text-cc-light font-bold mb-3">
            COMPLIANCE <span className="text-cc-gold">CORE</span>
          </h1>
          <p className="text-cc-tagline font-display tracking-widest uppercase text-lg">
            WHERE COMPLIANCE MEETS CONFIDENCE
          </p>
        </div>
        
        <p className="text-cc-light text-lg mb-6 max-w-2xl mx-auto">
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
