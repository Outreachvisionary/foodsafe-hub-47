
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-cc-ivory relative overflow-hidden">
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 border-2 border-cc-purple rounded-lg transform rotate-12"></div>
        <div className="absolute top-60 right-20 w-60 h-60 border-2 border-cc-purple rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border-2 border-cc-purple transform -rotate-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cc-charcoal leading-tight mb-6">
              Master complex compliance 
              <span className="block relative">
                across every facility
                <span className="absolute bottom-0 left-0 w-full h-1 bg-cc-purple"></span>
              </span>
            </h1>
            
            <div className="space-y-4 mb-8 font-sans text-lg text-cc-charcoal/80">
              <p>Unify food safety standards in one intelligent platform.</p>
              <p>Monitor compliance status across facilities in real time.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/demo">
                <Button 
                  className="bg-cc-purple hover:bg-cc-purple/90 text-white px-6 py-2.5 text-lg group font-sans"
                  size="lg"
                >
                  Start your compliance journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                className="border-cc-purple text-cc-purple hover:bg-cc-purple/5 px-6 py-2.5 text-lg font-sans"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch platform tour
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-cc-purple/10 rounded-lg z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Food production professional reviewing data"
                className="rounded-lg shadow-xl relative z-10"
              />
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-cc-purple/10 rounded-lg z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
