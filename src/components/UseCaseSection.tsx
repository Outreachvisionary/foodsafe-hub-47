
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Milk, Beef } from 'lucide-react';

interface UseCaseProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const UseCase: React.FC<UseCaseProps> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="p-6 bg-white rounded-lg shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-[#1A2B3C]/10 rounded-full flex items-center justify-center mr-4 text-[#1A2B3C]">
        {icon}
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#1A2B3C]">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const UseCaseSection = () => {
  const useCases = [
    {
      icon: <Box className="h-6 w-6" />,
      title: "Processed Food Manufacturers",
      description: "Ensure compliance across production lines for canned goods and packaged snacks with automated monitoring systems.",
    },
    {
      icon: <Milk className="h-6 w-6" />,
      title: "Dairy Producers",
      description: "Streamline safety protocols for milk, cheese, and yogurt facilities with specialized temperature and quality controls.",
    },
    {
      icon: <Beef className="h-6 w-6" />,
      title: "Meat Processors",
      description: "Track HACCP compliance for slaughterhouses and meatpacking plants with robust traceability and inspection tools.",
    },
  ];

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-[#1A2B3C]/10 text-[#1A2B3C] mb-4">
            Industry Solutions
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A2B3C]">
            Tailored for Food Manufacturing
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized solutions for different segments of the food production industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <UseCase
              key={index}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
