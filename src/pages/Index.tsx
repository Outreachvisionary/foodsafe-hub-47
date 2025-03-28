
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import StandardsSection from '@/components/StandardsSection';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeaturesSection from '@/components/FeaturesSection';
import ComplianceMetricsSection from '@/components/ComplianceMetricsSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero />
      
      <ComplianceMetricsSection />
      
      <StandardsSection />
      
      <FeaturesSection />
      
      <BenefitsSection />
      
      <CTASection />
      
      <TestimonialsSection />
      
      <div className="bg-fsms-lightBlue py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to improve your CAPA management?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Our new CAPA module helps you streamline corrective and preventive actions, 
            improve audit outcomes, and ensure FSMA 204 compliance.
          </p>
          <Link to="/capa">
            <Button className="bg-fsms-blue hover:bg-fsms-blue/90" size="lg">
              Explore CAPA Module
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
