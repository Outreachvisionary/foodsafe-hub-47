import React from 'react';
import { motion } from 'framer-motion';
const ROISection = () => {
  const metrics = [{
    value: "83%",
    label: "reduction in audit preparation time"
  }, {
    value: "67%",
    label: "fewer compliance incidents"
  }, {
    value: "100%",
    label: "digital documentation"
  }];
  return <section className="py-16 md:py-24 bg-cc-ivory relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-cc-purple"></div>
        <div className="absolute top-20 left-10 w-40 h-40 border-2 border-cc-purple rounded-lg transform rotate-12"></div>
        <div className="absolute top-60 right-20 w-60 h-60 border-2 border-cc-purple rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border-2 border-cc-purple transform -rotate-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Real Business Impact
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Our customers see significant improvements in compliance efficiency and food safety outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.2
        }} className="bg-cc-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl md:text-5xl font-bold font-display text-cc-darkTeal mb-2">
                {metric.value}
              </div>
              <p className="text-cc-charcoal/80 font-sans">
                {metric.label}
              </p>
            </motion.div>)}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-cc-charcoal/90 max-w-2xl mx-auto font-sans italic">
            "Compliance Core has transformed how we manage food safety across our manufacturing network. What used to take weeks now takes hours."
          </p>
          <p className="mt-4 font-display font-medium text-cc-tagline">
            — Operations Director, Leading Food Manufacturer
          </p>
        </div>
      </div>
    </section>;
};
export default ROISection;