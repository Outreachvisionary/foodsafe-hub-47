
import React from 'react';
import { motion } from 'framer-motion';

const VisualShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-lightGray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left side - Facility image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1613771404784-3a9625d13316?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
              alt="Food manufacturing facility with workers"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Right side - Platform interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-brand-teal px-4 py-2 text-white text-xs flex items-center">
              <div className="flex space-x-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <span>FoodSafeSync Dashboard</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
              alt="FoodSafeSync platform interface"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
