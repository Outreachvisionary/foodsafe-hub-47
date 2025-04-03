
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import StandardsSection from '@/components/StandardsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';
import FooterSection from '@/components/FooterSection';
import { Toaster } from '@/components/ui/toaster';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <StandardsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
      <FooterSection />
      <Toaster />
    </div>
  );
};

export default Home;
