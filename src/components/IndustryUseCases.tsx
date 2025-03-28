
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface UseCaseProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  delay?: number;
}

const UseCase: React.FC<UseCaseProps> = ({ icon, title, description, benefits, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center mb-6">
      <div className="text-4xl mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-fsms-dark">{title}</h3>
    </div>
    <p className="text-gray-600 mb-6">{description}</p>
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start">
          <div className="flex-shrink-0 text-fsms-blue mr-2 mt-1">
            <Check className="h-5 w-5" />
          </div>
          <span className="text-gray-700">{benefit}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const IndustryUseCases = () => {
  const useCases = [
    {
      icon: "🥩",
      title: "Meat/Poultry Processors",
      description: "Automate HACCP logs for slaughterhouses & packing plants",
      benefits: [
        "Real-time temperature monitoring",
        "Automated pathogen testing logs",
        "FSIS compliance documentation",
        "Recall readiness verification"
      ]
    },
    {
      icon: "🥛",
      title: "Dairy Facilities",
      description: "Real-time CCP monitoring for pasteurization & storage",
      benefits: [
        "Pasteurization validation records",
        "Allergen control documentation",
        "Environmental monitoring program",
        "Supply chain verification"
      ]
    },
    {
      icon: "🍱",
      title: "Ready-to-Eat Meals",
      description: "Batch tracking from ingredients to finished packaging",
      benefits: [
        "Multi-ingredient traceability",
        "Shelf-life verification data",
        "Packaging integrity validation",
        "Nutritional compliance checks"
      ]
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
            Industry Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-fsms-dark">
            Purpose-Built for Your Food Category
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized workflows for different segments of the food industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <UseCase
              key={index}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              benefits={useCase.benefits}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryUseCases;
