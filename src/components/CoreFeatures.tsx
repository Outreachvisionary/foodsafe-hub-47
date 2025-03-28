
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, BarChart2, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoreFeatures = () => {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Advanced Audit Management",
      description: "Streamline audit preparation with intelligent checklists and automated evidence collection for all major food safety standards.",
      link: "/platform/audit-management"
    },
    {
      icon: FileText,
      title: "Document Control System",
      description: "Centralize all compliance documentation with version control, approval workflows, and automated policy enforcement.",
      link: "/platform/document-control" 
    },
    {
      icon: BarChart2,
      title: "Risk Assessment Tools",
      description: "Identify and mitigate food safety risks with AI-powered analysis and continuous monitoring across production lines.",
      link: "/platform/risk-assessment"
    },
    {
      icon: Building2,
      title: "Multi-facility Compliance",
      description: "Maintain consistent standards across all locations with centralized management and facility-specific adaptations.",
      link: "/platform/multi-facility"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Powerful Tools for Food Safety Excellence
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Our comprehensive suite of tools helps you maintain compliance while streamlining operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-cc-white p-6 rounded-lg shadow-md border border-cc-purple/10 hover:border-cc-purple/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-cc-charcoal mb-2">
                {feature.title}
              </h3>
              <p className="text-cc-charcoal/70 mb-4 font-sans">
                {feature.description}
              </p>
              
              <Link to={feature.link} className="inline-flex items-center text-cc-purple hover:text-cc-purple/80 font-sans font-medium group">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
