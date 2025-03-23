
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, FileText, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="section-padding bg-fsms-blue text-white text-center">
      <div className="page-container">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ready to Simplify Your Food Safety Compliance?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join thousands of food businesses that have streamlined their compliance process with FoodSafeHub.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-white text-fsms-blue hover:bg-white/90 px-8 py-6 text-lg"
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="h-10 w-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">FSMA Compliant</h3>
              <p className="text-white/80 text-sm">
                Stay ahead of regulatory requirements with built-in FSMA 204 traceability tools.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <FileText className="h-10 w-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Easy Documentation</h3>
              <p className="text-white/80 text-sm">
                Generate audit-ready documentation with our automated report builders.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Clipboard className="h-10 w-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Mock Recalls</h3>
              <p className="text-white/80 text-sm">
                Test your recall readiness with simulated scenarios and real-time tracking.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
