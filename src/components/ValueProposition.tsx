
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ValueProposition = () => {
  const propositions = [
    {
      title: "Streamline Regulatory Compliance",
      points: [
        "70% reduction in audit preparation time",
        "Automated tracking of FSMA, ISO 22000, and GFSI requirements",
        "Instant visibility of compliance status across all facilities"
      ]
    },
    {
      title: "Enhance Documentation Control",
      points: [
        "Centralized storage of all compliance documentation",
        "Automated versioning and approval workflows",
        "Real-time access to the latest documents from anywhere"
      ]
    },
    {
      title: "Reduce Risk and Liability",
      points: [
        "Early detection of potential compliance issues",
        "Automated risk assessments for suppliers and ingredients",
        "Comprehensive audit trails for all compliance activities"
      ]
    },
    {
      title: "Drive Operational Excellence",
      points: [
        "Standardized processes across multiple facilities",
        "Data-driven insights for continuous improvement",
        "Integrated quality and safety management systems"
      ]
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
          <span className="text-brand-teal font-medium">HOW WE DELIVER VALUE</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-darkGray mt-2">
            Clear benefits for food manufacturers
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propositions.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-brand-darkGray">{prop.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prop.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-xs">
                          ✓
                        </div>
                        <span className="ml-3 text-brand-darkGray/80">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
