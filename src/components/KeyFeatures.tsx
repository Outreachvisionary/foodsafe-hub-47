
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Building2, Bell } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="flex flex-col items-center p-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-16 h-16 bg-[#1A2B3C] rounded-full flex items-center justify-center mb-6 text-white">
      {icon}
    </div>
    <h3 className="font-playfair text-xl font-bold text-[#1A2B3C] mb-4 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

const KeyFeatures = () => {
  const features = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "AI-Driven Compliance Forecasting",
      description: "Predict compliance gaps before they occur with our proprietary machine learning algorithms that analyze your historical data.",
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Multi-Facility Audit Coordination",
      description: "Seamlessly manage audits across multiple facilities with centralized documentation and automated scheduling.",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Real-Time Regulatory Updates",
      description: "Stay ahead of changing regulations with instant notifications and guided implementation procedures.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-[#1A2B3C]/10 text-[#1A2B3C] mb-4">
            Key Features
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A2B3C]">
            Enterprise-Grade Compliance Platform
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Purpose-built tools for America's leading food manufacturers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
