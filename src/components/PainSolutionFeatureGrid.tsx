
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Shield, Thermometer } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="bg-fsms-lightBlue p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-fsms-dark">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const PainSolutionFeatureGrid = () => {
  const features = [
    {
      title: "Document Control",
      description: "Auto-version SOPs with AI-driven change tracking",
      icon: <FileText className="w-8 h-8 text-fsms-blue" />
    },
    {
      title: "Audit Management",
      description: "Prepare for FDA inspections 3x faster with smart checklists",
      icon: <Search className="w-8 h-8 text-fsms-blue" />
    },
    {
      title: "Supplier Compliance",
      description: "Score & monitor 500+ vendor risks automatically",
      icon: <Shield className="w-8 h-8 text-fsms-blue" />
    },
    {
      title: "HACCP Plans",
      description: "CCP monitoring with IoT sensor integration",
      icon: <Thermometer className="w-8 h-8 text-fsms-blue" />
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue mb-4">
            Food Safety Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-fsms-dark">
            Simplify Complex Compliance Requirements
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform transforms regulatory burdens into streamlined workflows
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSolutionFeatureGrid;
