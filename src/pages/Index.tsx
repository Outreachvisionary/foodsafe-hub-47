
import React, { useEffect } from 'react';
import MainNavigation from '@/components/MainNavigation';
import BrandHeader from '@/components/BrandHeader';
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
    
    // Update document background color to match branding
    document.body.classList.add('bg-cc-teal');
    
    return () => {
      // Clean up by removing the class when component unmounts
      document.body.classList.remove('bg-cc-teal');
    };
  }, []);

  return (
    <div className="min-h-screen bg-cc-teal">
      <MainNavigation />
      
      <BrandHeader />
      
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
