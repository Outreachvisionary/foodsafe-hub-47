
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1 bg-brand-teal text-white font-medium rounded-md mb-4">
              Streamline compliance
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-darkGray leading-tight">
              by unifying food safety standards management.
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xl text-brand-darkGray/80 mb-2">
              Simplify compliance by managing multiple standards in one place.
            </p>
            <p className="text-xl text-brand-darkGray/80 mb-8">
              Keep your food manufacturing business compliant and audit-ready 24/7.
            </p>
            
            <Link to="/demo">
              <Button 
                className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-6 text-lg group"
                size="lg"
              >
                Book a free demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
