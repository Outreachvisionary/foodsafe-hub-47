
import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const BeforeAfterComparison = () => {
  return (
    <section className="py-20 bg-[#F5F5F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-[#1A2B3C]/10 text-[#1A2B3C] mb-4">
            Transform Your Compliance
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A2B3C]">
            Why Choose FoodSafeHub?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            See the difference our platform makes in your daily operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <X className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#1A2B3C]">Before</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Paper-based systems lead to data silos and inefficiencies</p>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Manual audit preparation requires weeks of staff time</p>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Inconsistent compliance across multiple facilities</p>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Delayed responses to regulatory changes</p>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Limited visibility into compliance status</p>
              </li>
            </ul>
          </motion.div>
          
          {/* After Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#1A2B3C]">After</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Automated workflows ensure compliance 24/7 across all facilities</p>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Audit preparation time reduced by up to 70%</p>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Standardized processes across your entire operation</p>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Real-time regulatory updates with guided implementation</p>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Executive dashboards with comprehensive compliance metrics</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterComparison;
