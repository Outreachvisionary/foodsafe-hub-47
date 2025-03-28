
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PlatformOverview = () => {
  const features = [
    {
      title: "Streamlined Standards Management",
      description: "Configure all your food safety standards in one centralized platform with intelligent mappings across requirements.",
      points: ["Multi-standard support", "Automated cross-referencing", "Gap analysis tools"]
    },
    {
      title: "Real-time Compliance Monitoring",
      description: "Track your compliance status across all standards with live dashboards and intelligent alerts for potential issues.",
      points: ["Live compliance scorecards", "Predictive risk detection", "Automated alerts and notifications"]
    },
    {
      title: "Multi-facility Oversight",
      description: "Manage compliance across multiple locations with standardized processes and centralized monitoring capabilities.",
      points: ["Unified facility management", "Standardized processes", "Regional compliance insights"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Comprehensive Platform Overview
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Our intelligent compliance platform helps food manufacturers maintain standards across all operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-6 cc-border-left"
            >
              <h3 className="text-xl font-display font-bold text-cc-charcoal mb-3">
                {feature.title}
              </h3>
              <p className="text-cc-charcoal/80 mb-4 font-sans">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.points.map((point, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-cc-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-cc-charcoal/90 font-sans">{point}</span>
                  </div>
                ))}
              </div>

              <div className="absolute left-0 top-0 h-full w-0.5 bg-cc-purple"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
