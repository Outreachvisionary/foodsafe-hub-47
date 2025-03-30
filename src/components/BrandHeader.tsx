
import React from 'react';
import { Link } from 'react-router-dom';

const BrandHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-accent to-accent-light py-8 px-4 md:px-8 text-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center mb-6 my-[21px]">
          <h1 className="text-4xl md:text-5xl font-display mb-3 font-medium text-white">
            COMPLIANCE <span className="text-primary-foreground font-bold">CORE</span>
          </h1>
          <p className="text-white/90 font-display tracking-widest uppercase text-lg">
            WHERE COMPLIANCE MEETS CONFIDENCE
          </p>
        </div>
        
        <p className="text-lg mb-6 max-w-2xl mx-auto text-white/80">
          Streamline your food safety compliance with our comprehensive platform designed for modern enterprises.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/25 transition-all px-6 py-3 rounded-md font-display uppercase tracking-wider shadow-lg hover:shadow-xl">
            Sign In
          </Link>
          <Link to="/demo" className="bg-primary text-white hover:bg-primary-light transition-all px-6 py-3 rounded-md font-display uppercase tracking-wider shadow-lg hover:shadow-xl">
            Request Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandHeader;
