import React from 'react';
import { Link } from 'react-router-dom';
const BrandHeader: React.FC = () => {
  return <div className="bg-cc-teal py-8 px-4 md:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          
          <h1 className="text-4xl md:text-5xl font-display mb-3 font-medium text-zinc-900">
            COMPLIANCE <span className="text-cc-gold">CORE</span>
          </h1>
          <p className="text-cc-tagline font-display tracking-widest uppercase text-lg">
            WHERE COMPLIANCE MEETS CONFIDENCE
          </p>
        </div>
        
        <p className="text-lg mb-6 max-w-2xl mx-auto text-zinc-900">
          Streamline your food safety compliance with our comprehensive platform designed for modern enterprises.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="border-2 border-cc-gold text-cc-gold hover:bg-cc-gold/10 px-6 py-3 rounded-md font-display uppercase tracking-wider">
            Sign In
          </Link>
          <Link to="/demo" className="bg-cc-gold text-cc-teal hover:bg-cc-gold/90 px-6 py-3 rounded-md font-display uppercase tracking-wider">
            Request Demo
          </Link>
        </div>
      </div>
    </div>;
};
export default BrandHeader;