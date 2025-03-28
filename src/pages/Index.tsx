
import React, { useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import HeroSection from '@/components/HeroSection';
import PlatformOverview from '@/components/PlatformOverview';
import VisualDemo from '@/components/VisualDemo';
import CoreFeatures from '@/components/CoreFeatures';
import ProcessFlow from '@/components/ProcessFlow';
import MultiFacilityManagement from '@/components/MultiFacilityManagement';
import ROISection from '@/components/ROISection';
import TestimonialSection from '@/components/TestimonialSection';
import PlatformPreview from '@/components/PlatformPreview';
import CallToAction from '@/components/CallToAction';
import FooterSection from '@/components/FooterSection';
import ConversionTracker from '@/components/ConversionTracker';

const Index = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cc-ivory">
      <MainNavigation />
      
      <HeroSection />
      
      <PlatformOverview />
      
      <VisualDemo />
      
      <CoreFeatures />
      
      <ProcessFlow />
      
      <MultiFacilityManagement />
      
      <ROISection />
      
      <TestimonialSection />
      
      <PlatformPreview />
      
      <CallToAction />
      
      <FooterSection />
      
      {/* Conversion Tracking */}
      <ConversionTracker action="landing_page_view" />
    </div>
  );
};

export default Index;
