
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero />
      
      <StandardsSection />
      
      <BenefitsSection />
      
      <section className="section-padding bg-fsms-blue text-white text-center">
        <div className="page-container">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Simplify Your Food Safety Compliance?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of food businesses that have streamlined their compliance process with FoodSafeHub.
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-white text-fsms-blue hover:bg-white/90 px-8 py-6 text-lg"
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      
      <Footer />
    </div>
  );
};

export default Index;
