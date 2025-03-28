
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-[#1A2B3C] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-[#D4AF37]/5 blur-3xl rounded-full"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">
            Elevate Your Food Safety Standards
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join industry leaders who are transforming food safety compliance from a burden into a competitive advantage.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button 
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1A2B3C] font-bold px-8 py-6 text-lg w-full sm:w-auto"
                size="lg"
              >
                Schedule a Demo
              </Button>
            </Link>
            
            <Link to="/whitepaper">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Whitepaper
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
