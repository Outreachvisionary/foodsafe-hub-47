
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-teal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Become audit-ready within weeks, not months
            </h2>
            <p className="text-xl opacity-90">
              Join the hundreds of food manufacturers who have transformed their compliance processes with FoodSafeSync.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/demo">
              <Button 
                className="bg-white text-brand-teal hover:bg-white/90 px-8 py-6 text-lg group w-full sm:w-auto"
                size="lg"
              >
                Book a free demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/resources/white-paper">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
                size="lg"
              >
                Download white paper
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
