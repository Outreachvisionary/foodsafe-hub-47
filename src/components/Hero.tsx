
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Shield, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-fsms-blue/10 to-fsms-indigo/10 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-fsms-indigo/10 to-fsms-blue/10 blur-3xl" />
        <motion.div 
          className="absolute right-0 top-1/3 w-64 h-64 bg-gradient-to-br from-fsms-blue/5 to-fsms-indigo/5 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1] 
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror" 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
            Next-Generation Food Safety Management
          </span>
        </motion.div>
        
        <motion.h1 
          className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-fsms-dark max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Streamlined Food Safety Compliance for <span className="text-gradient">Global Standards</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A comprehensive platform that simplifies compliance with SQF, ISO 22000, FSSC 22000, HACCP, and BRC GS2 standards, all in one place.
        </motion.p>
        
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/dashboard">
            <Button 
              className="bg-fsms-blue hover:bg-fsms-blue/90 text-white px-8 py-6 text-lg"
              size="lg"
            >
              View Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link to="/standards">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Standards
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-16 relative w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="aspect-[16/9] rounded-xl overflow-hidden glass-panel shadow-xl">
            <div className="w-full h-full bg-gradient-to-br from-fsms-blue/5 to-fsms-indigo/10 flex items-center justify-center p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center">
                  <Shield className="h-10 w-10 text-fsms-blue mb-3" />
                  <h3 className="font-medium text-lg">Compliance Dashboard</h3>
                  <p className="text-sm text-center text-gray-600 mt-2">Monitor all your food safety standards in one place</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center">
                  <FileCheck className="h-10 w-10 text-fsms-blue mb-3" />
                  <h3 className="font-medium text-lg">HACCP Management</h3>
                  <p className="text-sm text-center text-gray-600 mt-2">Streamline your hazard control programs</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center">
                  <ArrowRight className="h-10 w-10 text-fsms-blue mb-3" />
                  <h3 className="font-medium text-lg">Digital Traceability</h3>
                  <p className="text-sm text-center text-gray-600 mt-2">Meet FSMA 204 requirements with ease</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg text-sm font-medium text-gray-700">
            Unified Food Safety Management Platform
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
