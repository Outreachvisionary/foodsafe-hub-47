import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle } from 'lucide-react';
const MultiFacilityManagement = () => {
  return <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Unified Control Across Locations
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Maintain consistent food safety standards across all your manufacturing facilities.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="lg:w-1/2">
            <div className="bg-cc-slate-200 p-8 rounded-lg shadow-md text-center">
              {/* Facility Map Visualization */}
              <div className="w-full h-80 relative">
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                  <div className="w-6 h-6 bg-cc-purple rounded-full flex items-center justify-center text-white relative">
                    <MapPin className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  </div>
                  <span className="text-xs font-medium mt-1 bg-white px-2 py-0.5 rounded shadow-sm">Seattle</span>
                </div>
                
                <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
                  <div className="w-6 h-6 bg-cc-purple rounded-full flex items-center justify-center text-white relative">
                    <MapPin className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  </div>
                  <span className="text-xs font-medium mt-1 bg-white px-2 py-0.5 rounded shadow-sm">Chicago</span>
                </div>
                
                <div className="absolute bottom-1/4 left-1/3 flex flex-col items-center">
                  <div className="w-6 h-6 bg-cc-purple rounded-full flex items-center justify-center text-white relative">
                    <MapPin className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  </div>
                  <span className="text-xs font-medium mt-1 bg-white px-2 py-0.5 rounded shadow-sm">Atlanta</span>
                </div>
                
                <div className="absolute bottom-1/3 right-1/5 flex flex-col items-center">
                  <div className="w-6 h-6 bg-cc-purple rounded-full flex items-center justify-center text-white relative">
                    <MapPin className="h-4 w-4" />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  </div>
                  <span className="text-xs font-medium mt-1 bg-white px-2 py-0.5 rounded shadow-sm">Dallas</span>
                </div>

                {/* Connector Lines */}
                <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="25%" x2="75%" y2="33%" stroke="#5B3A94" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="25%" y1="25%" x2="33%" y2="75%" stroke="#5B3A94" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="75%" y1="33%" x2="33%" y2="75%" stroke="#5B3A94" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="75%" y1="33%" x2="80%" y2="67%" stroke="#5B3A94" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="33%" y1="75%" x2="80%" y2="67%" stroke="#5B3A94" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="lg:w-1/2">
            <h3 className="text-2xl font-display font-bold text-cc-charcoal mb-4">
              Centralized Multi-facility Management
            </h3>
            <p className="text-cc-charcoal/80 mb-6 font-sans">
              Maintain consistency across all your manufacturing locations while accounting for facility-specific requirements and local regulations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-cc-purple mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-medium text-cc-charcoal">Standardized Processes</h4>
                  <p className="text-cc-charcoal/70 font-sans">Deploy consistent compliance processes across all facilities while maintaining location-specific configurations.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-cc-purple mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-medium text-cc-charcoal">Centralized Reporting</h4>
                  <p className="text-cc-charcoal/70 font-sans">Generate organization-wide compliance reports with facility-specific breakdowns and comparative analytics.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-cc-purple mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-display font-medium text-cc-charcoal">Cross-Facility Insights</h4>
                  <p className="text-cc-charcoal/70 font-sans">Identify best practices and improvement opportunities by comparing performance across facilities.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default MultiFacilityManagement;