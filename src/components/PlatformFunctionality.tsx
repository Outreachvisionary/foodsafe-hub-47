
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const PlatformFunctionality = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-teal font-medium">PLATFORM SHOWCASE</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-darkGray mt-2">
            Powerful tools for seamless compliance
          </h2>
          <p className="mt-4 text-lg text-brand-darkGray/70 max-w-3xl mx-auto">
            Our platform provides comprehensive tools designed specifically for food manufacturers to streamline compliance processes.
          </p>
        </motion.div>
        
        <div className="space-y-16">
          {/* Audit Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold text-brand-darkGray mb-4">Audit Readiness Dashboard</h3>
              <p className="text-brand-darkGray/70 mb-6">
                Real-time visibility of your compliance status across all facilities. Know exactly where you stand before auditors arrive.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Automatic compliance scoring</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Gap analysis and prioritized action items</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Scheduled and on-demand audit preparation reports</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="shadow-lg rounded-lg overflow-hidden"
            >
              <Card className="overflow-hidden border-0">
                <div className="bg-brand-teal px-4 py-2 text-white text-xs flex items-center">
                  <div className="flex space-x-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span>Audit Readiness Dashboard</span>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Audit Readiness Dashboard"
                  className="w-full h-auto"
                />
              </Card>
            </motion.div>
          </div>
          
          {/* Documentation Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1 shadow-lg rounded-lg overflow-hidden"
            >
              <Card className="overflow-hidden border-0">
                <div className="bg-brand-teal px-4 py-2 text-white text-xs flex items-center">
                  <div className="flex space-x-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span>Document Management Interface</span>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Document Management Interface"
                  className="w-full h-auto"
                />
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <h3 className="text-2xl font-bold text-brand-darkGray mb-4">Documentation Management</h3>
              <p className="text-brand-darkGray/70 mb-6">
                Centralized control of all food safety documentation with powerful version control and approval workflows.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Automated document lifecycle management</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Secure, role-based access control</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Digital signatures and approval tracking</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Compliance Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold text-brand-darkGray mb-4">Compliance Tracking</h3>
              <p className="text-brand-darkGray/70 mb-6">
                Comprehensive monitoring of compliance status across all facilities, departments, and requirements.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Multi-standard compliance mapping</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Real-time compliance alerts and notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                    ✓
                  </div>
                  <span className="ml-3 text-brand-darkGray/80">Historical compliance trend analysis</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="shadow-lg rounded-lg overflow-hidden"
            >
              <Card className="overflow-hidden border-0">
                <div className="bg-brand-teal px-4 py-2 text-white text-xs flex items-center">
                  <div className="flex space-x-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span>Compliance Tracking Dashboard</span>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80" 
                  alt="Compliance Tracking Dashboard"
                  className="w-full h-auto"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFunctionality;
