
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import FooterSection from '@/components/FooterSection';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ConversionTracker from '@/components/ConversionTracker';

const Solutions = () => {
  const { solutionType, industryType } = useParams();
  const type = industryType || solutionType; // Handle both route patterns
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [type]);
  
  // Solution-specific content
  const solutionContent = {
    'processed-foods': {
      title: 'Processed Foods',
      description: 'Ensure compliance across production lines for canned goods and packaged snacks.',
      features: [
        'Streamlined allergen management',
        'Label verification workflows',
        'Batch processing compliance',
        'Foreign material control',
        'Packaging integrity verification'
      ],
      image: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'dairy': {
      title: 'Dairy',
      description: 'Streamline safety protocols for milk, cheese, and yogurt facilities.',
      features: [
        'Temperature monitoring integration',
        'Pasteurization verification',
        'Milk allergen controls',
        'Cold chain management',
        'Shelf-life validation'
      ],
      image: 'https://images.unsplash.com/photo-1563201515-e8c940960b45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'meat-processing': {
      title: 'Meat Processing',
      description: 'Track HACCP compliance for slaughterhouses and meatpacking plants.',
      features: [
        'Critical control point monitoring',
        'Sanitation verification',
        'Cold chain compliance',
        'Carcass tracking',
        'Pathogen prevention protocols'
      ],
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'bakery': {
      title: 'Bakery',
      description: 'Ensure food safety compliance for commercial bakeries and packaged baked goods.',
      features: [
        'Allergen cross-contamination prevention',
        'Baking temperature validation',
        'Ingredient traceability',
        'Shelf-life monitoring',
        'Sanitation program management'
      ],
      image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  };
  
  const content = solutionContent[type as keyof typeof solutionContent] || {
    title: 'Food Manufacturing Solutions',
    description: 'Comprehensive food safety compliance solutions for all types of food manufacturing.',
    features: [
      'Standards management',
      'Audit preparation',
      'Document control',
      'Supplier verification',
      'Training management'
    ],
    image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return (
    <div className="min-h-screen bg-cc-ivory">
      <MainNavigation />
      
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-cc-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <span className="inline-block px-4 py-1 bg-cc-purple text-white font-medium rounded-md mb-4 font-sans">
                Industry Solution
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal leading-tight mb-4">
                {content.title}
              </h1>
              <p className="text-xl text-cc-charcoal/80 mb-6 font-sans">
                {content.description}
              </p>
              
              <div className="space-y-3 mb-8">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cc-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-cc-charcoal/80 font-sans">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/demo">
                  <Button 
                    className="bg-cc-purple hover:bg-cc-purple/90 text-white px-6 py-2.5 text-lg group font-sans"
                    size="lg"
                  >
                    Request a demo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/resources/white-paper">
                  <Button 
                    variant="outline"
                    className="border-cc-purple text-cc-purple hover:bg-cc-purple/5 px-6 py-2.5 text-lg font-sans"
                    size="lg"
                  >
                    Download white paper
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2 rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src={content.image} 
                alt={`${content.title} solution`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-cc-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
              Compliance Made Simple
            </h2>
            <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
              Our platform simplifies compliance for {content.title.toLowerCase()} manufacturers through automation and intelligent workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-cc-white p-6 rounded-lg shadow-md"
            >
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Documentation Management</h3>
              <p className="text-cc-charcoal/70 font-sans">Centralize all your important documents with version control and approval workflows.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-cc-white p-6 rounded-lg shadow-md"
            >
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Audit Readiness</h3>
              <p className="text-cc-charcoal/70 font-sans">Always be prepared for inspections with real-time compliance tracking and gap analysis.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-cc-white p-6 rounded-lg shadow-md"
            >
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Real-time Analytics</h3>
              <p className="text-cc-charcoal/70 font-sans">Monitor your compliance metrics across all facilities with dashboards and reports.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FooterSection />
      
      <ConversionTracker action={`view_${type}_solution`} />
    </div>
  );
};

export default Solutions;
