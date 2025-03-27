import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainNavigation from '@/components/MainNavigation';
import FooterSection from '@/components/FooterSection';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ConversionTracker from '@/components/ConversionTracker';
const Products = () => {
  const {
    productType,
    moduleType
  } = useParams();
  const type = moduleType || productType; // Handle both route patterns

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [type]);

  // Product-specific content
  const productContent = {
    'audit-management': {
      title: 'Audit Management',
      description: 'Real-time tracking across multi-facility operations with automated compliance verification and reporting.',
      features: ['Multi-standard audit scheduling', 'Mobile audit checklists', 'Real-time non-conformance tracking', 'Automatic corrective action assignment', 'Dashboard with audit readiness scoring'],
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'document-control': {
      title: 'Document Control',
      description: 'AI-powered versioning and approval workflows ensure your documents are always current and accessible.',
      features: ['Automated document review cycles', 'Role-based document access control', 'Digital signatures and approvals', 'Document change management', 'Training record integration'],
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'supplier-compliance': {
      title: 'Supplier Compliance',
      description: 'Automated risk assessments for vendors with continuous monitoring and evaluation of critical suppliers.',
      features: ['Supplier performance scorecards', 'Certificate of Analysis tracking', 'Automated supplier verification', 'Supplier documentation management', 'Risk-based approval workflows'],
      image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'risk-assessment': {
      title: 'Risk Assessment',
      description: 'Identify and mitigate food safety risks with AI-powered analysis and continuous monitoring across production.',
      features: ['HACCP plan integration', 'Hazard identification tools', 'Risk matrix automation', 'Preventive controls tracking', 'Multi-standard risk mapping'],
      image: 'https://images.unsplash.com/photo-1572059457382-99d00a7813e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'reporting': {
      title: 'Reporting Dashboard',
      description: 'Comprehensive analytics and reporting tools for data-driven food safety management decisions.',
      features: ['Customizable executive dashboards', 'Compliance trend analysis', 'Automated regulatory reporting', 'Facility comparison tools', 'Export capabilities for audits'],
      image: 'https://images.unsplash.com/photo-1560442865-adadb02d6a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    'multi-facility': {
      title: 'Multi-facility Management',
      description: 'Centralized oversight of all locations with standardized processes and facility-specific adaptations.',
      features: ['Enterprise-wide compliance visibility', 'Location-specific configurations', 'Standardized process deployment', 'Cross-facility benchmarking', 'Regional compliance settings'],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  };
  const content = productContent[type as keyof typeof productContent] || {
    title: 'Food Safety Platform',
    description: 'Comprehensive food safety compliance tools designed for modern food manufacturing operations.',
    features: ['Real-time compliance tracking', 'Multi-facility management', 'Document control system', 'Supplier verification program', 'Audit management tools'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };
  return <div className="min-h-screen bg-cc-ivory">
      <MainNavigation />
      
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-cc-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="lg:w-1/2">
              <span className="inline-block px-4 py-1 bg-cc-gold/90 text-teal font-medium rounded-md mb-4 font-sans">
                Platform Module
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal leading-tight mb-4">
                {content.title}
              </h1>
              <p className="text-xl text-cc-charcoal/80 mb-6 font-sans">
                {content.description}
              </p>
              
              <div className="space-y-3 mb-8">
                {content.features.map((feature, index) => <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-cc-gold/90 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-cc-charcoal/80 font-sans">{feature}</span>
                  </div>)}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/demo">
                  <Button size="lg" className="bg-cc-purple hover:bg-cc-teal text-white px-6 py-2.5 text-lg group font-sans">
                    Request a demo
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/resources/white-paper">
                  <Button variant="outline" size="lg" className="border-cc-teal text-cc-white hover:bg-cc-teal px-6 py-2.5 text-lg font-sans">
                    Download white paper
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.7
          }} className="lg:w-1/2 rounded-xl overflow-hidden shadow-lg">
              <img src={content.image} alt={`${content.title} module`} className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-cc-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
              Key Benefits
            </h2>
            <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
              Our {content.title.toLowerCase()} solution helps food manufacturers streamline operations and ensure compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }} className="bg-cc-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Save Time</h3>
              <p className="text-cc-charcoal/70 font-sans">Reduce manual work and paperwork by up to 75% with automated workflows and digital documentation.</p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="bg-cc-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Reduce Risk</h3>
              <p className="text-cc-charcoal/70 font-sans">Proactively identify and address compliance gaps before they become issues with real-time monitoring.</p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="bg-cc-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-cc-purple/10 rounded-lg flex items-center justify-center mb-4 text-cc-purple">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-display text-cc-charcoal mb-2">Grow Revenue</h3>
              <p className="text-cc-charcoal/70 font-sans">Win new business with verified compliance data and demonstrate your commitment to food safety excellence.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FooterSection />
      
      <ConversionTracker action={`view_${type}_product`} />
    </div>;
};
export default Products;