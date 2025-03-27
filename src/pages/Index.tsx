
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import TrustIndicators from '@/components/TrustIndicators';
import KeyFeatures from '@/components/KeyFeatures';
import TestimonialSection from '@/components/TestimonialSection';
import PlatformPreview from '@/components/PlatformPreview';
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
      
      <KeyFeatures />
      
      <TestimonialSection />
      
      <PlatformPreview />
      
      <CallToAction />
      
      <Footer />
      
      {/* Conversion Tracking */}
      <ConversionTracker action="landing_page_view" />
    </div>
  );
};

export default Index;
