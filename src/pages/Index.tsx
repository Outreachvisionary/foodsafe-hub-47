
import React, { useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import HeroSection from '@/components/HeroSection';
import FooterSection from '@/components/FooterSection';
import VisualShowcase from '@/components/VisualShowcase';
import KeyFeatures from '@/components/KeyFeatures';
import PlatformFunctionality from '@/components/PlatformFunctionality';
import ValueProposition from '@/components/ValueProposition';
import Testimonials from '@/components/Testimonials';
import CallToActionSection from '@/components/CallToActionSection';
import ConversionTracker from '@/components/ConversionTracker';

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      
      <HeroSection />
      
      <VisualShowcase />
      
      <KeyFeatures />
      
      <PlatformFunctionality />
      
      <ValueProposition />
      
      <Testimonials />
      
      <CallToActionSection />
      
      <FooterSection />
      
      {/* Conversion Tracking */}
      <ConversionTracker action="landing_page_view" />
    </div>
  );
};

export default Index;
