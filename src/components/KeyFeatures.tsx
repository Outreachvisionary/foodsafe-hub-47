
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, ShieldCheck, BarChart } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-4 text-brand-teal">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-brand-darkGray mb-3">{title}</h3>
    <p className="text-brand-darkGray/70">{description}</p>
  </motion.div>
);

const KeyFeatures = () => {
  const features = [
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Audit Management",
      description: "Real-time tracking across multi-facility operations with automated compliance verification and reporting."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Control",
      description: "AI-powered versioning and approval workflows ensure your documents are always current and accessible."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Supplier Compliance",
      description: "Automated risk assessments for vendors with continuous monitoring and evaluation of critical suppliers."
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Real-time insights and trend analysis to identify improvement opportunities across all facilities."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-teal font-medium">PLATFORM CAPABILITIES</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-darkGray mt-2">
            Comprehensive food safety compliance
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
