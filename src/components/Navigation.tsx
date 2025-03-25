
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-display font-semibold text-fsms-dark"
            >
              FoodSafe<span className="text-fsms-blue">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-fsms-blue transition-colors">
              {t('navigation.home')}
            </Link>
            <Link to="/standards" className="text-gray-700 hover:text-fsms-blue transition-colors">
              {t('navigation.standards')}
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-fsms-blue transition-colors">
              {t('navigation.features')}
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-fsms-blue transition-colors">
              {t('navigation.pricing')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-fsms-blue transition-colors">
              {t('navigation.about')}
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('common.search')}
                className="pl-10 pr-4 py-2 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-fsms-blue/20 focus:border-fsms-blue w-48 transition-all"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Auth Buttons and Language Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost">
              {t('common.login')}
            </Button>
            <Button className="bg-fsms-blue hover:bg-fsms-blue/90 text-white">
              {t('common.getStarted')}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 py-2 hover:text-fsms-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                to="/standards" 
                className="text-gray-700 py-2 hover:text-fsms-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.standards')}
              </Link>
              <Link 
                to="/features" 
                className="text-gray-700 py-2 hover:text-fsms-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.features')}
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-700 py-2 hover:text-fsms-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.pricing')}
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 py-2 hover:text-fsms-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
              <div className="pt-3 space-y-3">
                <LanguageSelector />
                <Button variant="outline" className="w-full">
                  {t('common.login')}
                </Button>
                <Button className="w-full bg-fsms-blue hover:bg-fsms-blue/90 text-white">
                  {t('common.getStarted')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
