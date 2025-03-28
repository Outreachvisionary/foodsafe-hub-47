
import React from 'react';
import { motion } from 'framer-motion';

const VisualDemo = () => {
  return (
    <section className="py-16 md:py-24 bg-cc-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              <div className="absolute -left-3 -top-3 w-24 h-24 bg-cc-purple/10 rounded-lg z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Food manufacturing facility"
                className="rounded-lg shadow-lg relative z-10"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="relative shadow-xl rounded-lg overflow-hidden border-2 border-cc-purple/20">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Compliance Core dashboard"
                  className="w-full"
                />
                
                {/* Overlays to highlight key features */}
                <div className="absolute top-[20%] left-[15%] w-24 h-16 border-2 border-cc-purple rounded-md animate-pulse"></div>
                <div className="absolute bottom-[30%] right-[20%] w-20 h-20 border-2 border-cc-purple rounded-md animate-pulse"></div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cc-purple/90 px-6 py-4 rounded-lg text-white text-center max-w-[80%] shadow-lg">
                <p className="font-display font-bold">See your entire operation's compliance status at a glance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisualDemo;
