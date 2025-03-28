
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const PlatformPreview = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-[#1A2B3C]/10 text-[#1A2B3C] mb-4">
            Platform Preview
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A2B3C]">
            Command Center for Food Safety Excellence
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive visibility across all your facilities and compliance requirements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <Card className="overflow-hidden shadow-xl border-0 rounded-xl">
            <div className="bg-[#1A2B3C] p-2 flex items-center">
              <div className="flex space-x-2 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-white text-sm mx-auto pr-12">FoodSafe Executive Dashboard</div>
            </div>
            <div className="bg-gray-50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Platform Dashboard"
                className="w-full object-cover transform hover:scale-105 transition-transform duration-700"
                style={{ height: '500px' }}
              />
            </div>
          </Card>
          
          {/* Floating stats cards */}
          <div className="absolute -bottom-6 -right-6 md:right-12 md:bottom-12 z-10 animate-pulse">
            <Card className="bg-white p-4 shadow-lg border-t-4 border-green-500 w-48">
              <div className="text-sm text-gray-500">Compliance Score</div>
              <div className="text-2xl font-bold text-[#1A2B3C]">96.8%</div>
              <div className="text-xs text-green-600">↑ 3.2% from last month</div>
            </Card>
          </div>
          
          <div className="absolute top-1/3 -left-6 md:left-12 z-10 animate-pulse" style={{ animationDelay: '1s' }}>
            <Card className="bg-white p-4 shadow-lg border-t-4 border-[#D4AF37] w-48">
              <div className="text-sm text-gray-500">Active Facilities</div>
              <div className="text-2xl font-bold text-[#1A2B3C]">12</div>
              <div className="text-xs text-[#D4AF37]">All in compliance</div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformPreview;
