
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, FileText, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 bg-fsms-blue text-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Get FDA-Ready in 14 Days
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join hundreds of food businesses that have streamlined their compliance 
            process with our platform. Start your risk-free trial today.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/auth?mode=register">
              <Button 
                size="lg" 
                className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white px-8 py-6 text-lg w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/standards">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
              >
                Explore Platform
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
              <h3 className="text-xl font-semibold mb-2">90-Day Guarantee</h3>
              <p className="text-white/80 text-sm">
                If you don't see improved compliance in 90 days, we'll extend your subscription for free.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <FileText className="h-10 w-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Free Migration</h3>
              <p className="text-white/80 text-sm">
                Our team will help migrate your existing documentation and set up your compliance system.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Clipboard className="h-10 w-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-white/80 text-sm">
                Get unlimited access to our team of food safety consultants during your implementation.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
