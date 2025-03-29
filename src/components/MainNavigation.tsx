import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';
const MainNavigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);
  const isActiveLink = (path: string) => {
    return location.pathname === path || path !== '/' && location.pathname.startsWith(path);
  };
  return <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-cc-teal">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-display font-bold text-cc-light">
              Compliance<span className="px-1 rounded font-bold text-cc-gold">Core</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8 hover:bg-cc-gold/90">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-display text-cc-light hover:text-cc-gold -ml-4 ${isActiveLink('/platform') ? 'cc-underline font-medium' : ''}`}>
                  Platform <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-tagline">
                <DropdownMenuItem>
                  <Link to="/platform/audit-management" className="w-full font-sans">Audit Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/document-control" className="w-full font-sans">Document Control</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/risk-assessment" className="w-full font-sans">Risk Assessment</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/reporting" className="w-full font-sans">Reporting Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-display text-cc-light hover:text-cc-gold -ml-4 ${isActiveLink('/industries') ? 'cc-underline font-medium' : ''}`}>
                  Industries <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-tagline">
                <DropdownMenuItem>
                  <Link to="/industries/processed-foods" className="w-full font-sans">Processed Foods</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/dairy" className="w-full font-sans">Dairy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/meat-processing" className="w-full font-sans">Meat Processing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/bakery" className="w-full font-sans">Bakery</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-display text-cc-light hover:text-cc-gold -ml-4 ${isActiveLink('/resources') ? 'cc-underline font-medium' : ''}`}>
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-tagline">
                <DropdownMenuItem>
                  <Link to="/resources/guides" className="w-full font-sans">Guides</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/blog" className="w-full font-sans">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/case-studies" className="w-full font-sans">Case Studies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/webinars" className="w-full font-sans">Webinars</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-display text-cc-light hover:text-cc-gold -ml-4 ${isActiveLink('/integrations') ? 'cc-underline font-medium' : ''}`}>
                  Integrations <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-tagline">
                <DropdownMenuItem>
                  <Link to="/integrations/erp" className="w-full font-sans">ERP Systems</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/integrations/lab-systems" className="w-full font-sans">Lab Systems</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/integrations/sensors" className="w-full font-sans">Sensor Networks</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/about" className={`font-display text-cc-light hover:text-cc-gold px-3 py-2 ${isActiveLink('/about') ? 'cc-underline font-medium' : ''}`}>
              About
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-display text-cc-light hover:text-cc-gold">
              Sign In
            </Link>
            <Link to="/demo">
              <Button className="bg-cc-gold hover:bg-cc-gold/90 text-cc-teal font-display">
                Request Demo
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsNavOpen(!isNavOpen)} className="text-cc-light">
              {isNavOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isNavOpen && <div className="fixed inset-0 bg-cc-teal bg-opacity-98 z-40 pt-16 md:hidden">
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="py-2 border-b border-cc-gold/30">
              <div className="text-lg font-display font-medium mb-1 text-cc-gold">Platform</div>
              <Link to="/platform/audit-management" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Audit Management
              </Link>
              <Link to="/platform/document-control" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Document Control
              </Link>
              <Link to="/platform/risk-assessment" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Risk Assessment
              </Link>
              <Link to="/platform/reporting" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Reporting Dashboard
              </Link>
            </div>
            
            <div className="py-2 border-b border-cc-gold/30">
              <div className="text-lg font-display font-medium mb-1 text-cc-gold">Industries</div>
              <Link to="/industries/processed-foods" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Processed Foods
              </Link>
              <Link to="/industries/dairy" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Dairy
              </Link>
              <Link to="/industries/meat-processing" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Meat Processing
              </Link>
              <Link to="/industries/bakery" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Bakery
              </Link>
            </div>
            
            <div className="py-2 border-b border-cc-gold/30">
              <div className="text-lg font-display font-medium mb-1 text-cc-gold">Resources</div>
              <Link to="/resources/guides" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Guides
              </Link>
              <Link to="/resources/blog" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Blog
              </Link>
              <Link to="/resources/case-studies" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Case Studies
              </Link>
              <Link to="/resources/webinars" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Webinars
              </Link>
            </div>
            
            <div className="py-2 border-b border-cc-gold/30">
              <div className="text-lg font-display font-medium mb-1 text-cc-gold">Integrations</div>
              <Link to="/integrations/erp" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                ERP Systems
              </Link>
              <Link to="/integrations/lab-systems" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Lab Systems
              </Link>
              <Link to="/integrations/sensors" className="block py-2 font-sans text-cc-light hover:text-cc-gold">
                Sensor Networks
              </Link>
            </div>
            
            <div className="py-2 border-b border-cc-gold/30">
              <Link to="/about" className="block py-2 text-lg font-display font-medium text-cc-light hover:text-cc-gold">
                About
              </Link>
            </div>
            
            <div className="pt-4 mt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full mb-2 font-display border-cc-gold text-cc-gold hover:bg-cc-gold/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/demo">
                <Button className="w-full bg-cc-gold hover:bg-cc-gold/90 text-cc-teal font-display">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>}
    </nav>;
};
export default MainNavigation;