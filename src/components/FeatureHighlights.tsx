
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, ShieldCheck } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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

const FeatureHighlights = () => {
  const features = [
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: "Audit Management",
      description: "Real-time tracking across multi-facility operations with automated compliance verification and reporting.",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Control",
      description: "AI-powered versioning and approval workflows ensure your documents are always current and accessible.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Supplier Compliance",
      description: "Automated risk assessments for vendors with continuous monitoring and evaluation of critical suppliers.",
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
            Feature Highlights
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A2B3C]">
            Comprehensive Compliance Solutions
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools designed for food manufacturers to streamline compliance processes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

export default FeatureHighlights;
