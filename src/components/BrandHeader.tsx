
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BrandHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary-light to-accent py-8 px-4 md:px-8 text-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary-light rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center mb-6 my-[21px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-display mb-3 font-bold text-white drop-shadow-lg">
            COMPLIANCE <span className="text-accent-foreground font-black">CORE</span>
          </h1>
          <motion.p 
            className="text-white/90 font-display tracking-widest uppercase text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            WHERE COMPLIANCE MEETS CONFIDENCE
          </motion.p>
        </motion.div>
        
        <motion.p 
          className="text-xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Streamline your food safety compliance with our comprehensive platform designed for modern enterprises.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Link to="/login" className="bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/25 transition-all px-6 py-3 rounded-md font-display uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 hover:border-white/50">
            Sign In
          </Link>
          <Link to="/demo" className="bg-accent text-white hover:bg-accent-light transition-all px-6 py-3 rounded-md font-display uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105">
            Request Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandHeader;
