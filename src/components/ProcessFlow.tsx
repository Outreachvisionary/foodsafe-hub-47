import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ClipboardCheck, Activity, FileText } from 'lucide-react';
const ProcessFlow = () => {
  const steps = [{
    icon: Settings,
    title: "Configure Standards",
    description: "Set up your compliance requirements based on relevant food safety standards."
  }, {
    icon: ClipboardCheck,
    title: "Implement Checks",
    description: "Deploy automated monitoring and verification processes."
  }, {
    icon: Activity,
    title: "Monitor Compliance",
    description: "Track real-time compliance status across all facilities and standards."
  }, {
    icon: FileText,
    title: "Generate Reports",
    description: "Create comprehensive compliance reports for internal and external audits."
  }];
  return <section className="py-16 md:py-24 bg-cc-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Streamlined Compliance Process
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Our intuitive workflow makes complex compliance management simple and efficient.
          </p>
        </div>
        
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-cc-purple/30 transform -translate-y-1/2 z-0"></div>
          
          <div className="rounded">
            {steps.map((step, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.2
          }} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-cc-white rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-cc-green">
                  <step.icon className="h-7 w-7 text-cc-purple" />
                </div>
                <h3 className="text-xl font-display font-bold text-cc-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-cc-charcoal/80 font-sans">
                  {step.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default ProcessFlow;