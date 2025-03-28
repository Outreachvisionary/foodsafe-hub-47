
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 cc-gradient-bg relative overflow-hidden">
      {/* Overlay pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 border-2 border-white rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold font-display text-white mb-6"
          >
            Ready to transform your compliance approach?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-sans"
          >
            Join leading food manufacturers who have streamlined their compliance processes and improved food safety outcomes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/demo">
              <Button 
                className="bg-white hover:bg-white/90 text-cc-purple px-8 py-6 text-lg font-sans"
                size="lg"
              >
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-sans"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch platform tour
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
