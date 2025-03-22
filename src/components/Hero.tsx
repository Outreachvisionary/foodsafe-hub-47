
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-fsms-blue/10 to-fsms-indigo/10 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-fsms-indigo/10 to-fsms-blue/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block animate-fade-in">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
            Simplified Food Safety Management
          </span>
        </div>
        
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-fsms-dark max-w-4xl mx-auto leading-tight animate-fade-up">
          Streamlined Food Safety Compliance for <span className="text-gradient">Global Standards</span>
        </h1>
        
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-up delay-100">
          A comprehensive platform that simplifies compliance with SQF, ISO 22000, FSSC 22000, HACCP, and BRC GS2 standards, all in one place.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
          <Button 
            className="bg-fsms-blue hover:bg-fsms-blue/90 text-white px-8 py-6 text-lg"
            size="lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg"
          >
            <Search className="mr-2 h-5 w-5" />
            Explore Standards
          </Button>
        </div>
        
        <div className="mt-16 relative w-full max-w-5xl mx-auto animate-fade-up delay-300">
          <div className="aspect-[16/9] rounded-xl overflow-hidden glass-panel shadow-xl">
            <div className="w-full h-full bg-gradient-to-br from-fsms-blue/5 to-fsms-indigo/10 flex items-center justify-center">
              <div className="text-lg text-gray-500">
                Dashboard Preview
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg text-sm font-medium text-gray-700">
            Multi-Standard Compliance Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
