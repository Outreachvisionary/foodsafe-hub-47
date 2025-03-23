
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
      
      <Footer />
    </div>
  );
};

export default Index;
