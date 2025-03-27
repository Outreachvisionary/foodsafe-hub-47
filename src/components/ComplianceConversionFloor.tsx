
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GuaranteeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Guarantee: React.FC<GuaranteeProps> = ({ icon, title, description }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 bg-fsms-lightBlue p-2 rounded-lg mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium text-fsms-dark mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const ComplianceConversionFloor = () => {
  const guarantees = [
    {
      icon: <Clock className="h-6 w-6 text-fsms-blue" />,
      title: "90-Day Compliance Guarantee",
      description: "If you don't see improved compliance metrics in 90 days, we'll extend your subscription for free."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-fsms-blue" />,
      title: "SOC 2 Certified Data Security",
      description: "Your sensitive compliance data is protected with enterprise-grade security protocols."
    },
    {
      icon: <Users className="h-6 w-6 text-fsms-blue" />,
      title: "Dedicated FSQA Support Team",
      description: "Get unlimited access to our team of food safety experts for implementation assistance."
    }
  ];

  return (
    <section className="py-24 bg-fsms-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Risk-Free Implementation
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Start improving your food safety compliance today with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Guarantee
                  icon={guarantee.icon}
                  title={guarantee.title}
                  description={guarantee.description}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6">
            Get FDA-Ready in 14 Days
          </h3>
          <Link to="/auth?mode=register">
            <Button 
              size="lg" 
              className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white px-8 py-6 text-lg"
            >
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-white/70 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplianceConversionFloor;
