
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import TrustArchitecture from '@/components/TrustArchitecture';
import PainSolutionFeatureGrid from '@/components/PainSolutionFeatureGrid';
import IndustrySocialProof from '@/components/IndustrySocialProof';
import IndustryUseCases from '@/components/IndustryUseCases';
import ComplianceConversionFloor from '@/components/ComplianceConversionFloor';
import ConversionTracker from '@/components/ConversionTracker';

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero />
      
      <TrustArchitecture />
      
      <PainSolutionFeatureGrid />
      
      <IndustrySocialProof />
      
      <IndustryUseCases />
      
      <ComplianceConversionFloor />
      
      <Footer />
      
      {/* Conversion Tracking */}
      <ConversionTracker action="landing_page_view" />
    </div>
  );
};

export default Index;
