
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Clipboard, BarChart3, ClipboardCheck, AlertTriangle, Users, Clock } from 'lucide-react';

const features = [
  {
    title: "HACCP Management",
    description: "Digitize your HACCP plans with automated monitoring of critical control points and instant alerts.",
    icon: <AlertTriangle className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Traceability",
    description: "Meet FSMA 204 requirements with complete batch tracking and mock recall simulations.",
    icon: <ClipboardCheck className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Supplier Management",
    description: "Evaluate and monitor supplier performance with integrated risk assessment tools.",
    icon: <Users className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Compliance Reporting",
    description: "Generate comprehensive reports for internal audits and regulatory inspections.",
    icon: <BarChart3 className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Document Control",
    description: "Centralized repository for all your food safety documents with version control.",
    icon: <FileCheck className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-cyan-500 to-cyan-600"
  },
  {
    title: "Training Management",
    description: "Track employee training and certifications with automated reminders for renewals.",
    icon: <Clock className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />,
    color: "from-rose-500 to-rose-600"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const FeaturesSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="page-container">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Platform Features
          </motion.span>
          <motion.h2 
            className="mt-4 text-3xl md:text-4xl font-bold text-fsms-dark"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Comprehensive Food Safety Tools
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to manage food safety compliance in a single, integrated platform.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              variants={item}
              className="group"
            >
              <div className="rounded-xl overflow-hidden shadow-lg h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className={`bg-gradient-to-br ${feature.color} p-6 flex justify-center`}>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
