
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Check } from 'lucide-react';

const TrustIndicators = () => {
  const logoVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * custom, duration: 0.5 }
    })
  };

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-3xl font-bold text-[#1A2B3C]">
            Trusted by Industry Leaders
          </h2>
        </motion.div>

        {/* Client Logos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center"
              variants={logoVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={index}
            >
              <div className="h-12 flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-300 h-8 w-32 rounded-md flex items-center justify-center text-gray-600 font-medium">
                  {company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm text-center flex flex-col items-center"
          >
            <div className="p-3 bg-[#1A2B3C]/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-[#1A2B3C]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">FSMA Compliant</h3>
            <p className="text-gray-600">Fully aligned with FDA's Food Safety Modernization Act requirements</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm text-center flex flex-col items-center"
          >
            <div className="p-3 bg-[#1A2B3C]/10 rounded-full mb-4">
              <Award className="h-8 w-8 text-[#1A2B3C]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">ISO 22000 Certified</h3>
            <p className="text-gray-600">Meeting international standards for food safety management systems</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm text-center flex flex-col items-center"
          >
            <div className="p-3 bg-[#1A2B3C]/10 rounded-full mb-4">
              <Check className="h-8 w-8 text-[#1A2B3C]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">GFSI Recognized</h3>
            <p className="text-gray-600">Benchmarked against Global Food Safety Initiative standards</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
