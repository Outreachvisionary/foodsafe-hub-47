
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import TrustIndicators from '@/components/TrustIndicators';
import FeatureHighlights from '@/components/FeatureHighlights';
import UseCaseSection from '@/components/UseCaseSection';
import PlatformPreview from '@/components/PlatformPreview';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import CallToAction from '@/components/CallToAction';
import ConversionTracker from '@/components/ConversionTracker';

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Hero />
      
      <TrustIndicators />
      
      <FeatureHighlights />
      
      <UseCaseSection />
      
      <PlatformPreview />
      
      <BeforeAfterComparison />
      
      <CallToAction />
      
      <Footer />
      
      {/* Conversion Tracking */}
      <ConversionTracker action="landing_page_view" />
    </div>
  );
};

export default Index;
