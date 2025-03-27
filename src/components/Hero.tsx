
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Modern food production facility"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2B3C]/70 to-[#1A2B3C]/90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Elevate Food Safety Compliance for Industry Leaders
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            AI-Powered FSMA, HACCP, and GMP Management for America's Top Food Manufacturers
          </motion.p>
          
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/contact">
              <Button 
                className="bg-[#1A2B3C] hover:bg-[#1A2B3C]/90 text-white border-2 border-[#D4AF37] px-8 py-6 text-lg rounded-md"
                size="lg"
              >
                Request Executive Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
