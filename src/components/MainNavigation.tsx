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
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-cc-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-display font-bold text-cc-charcoal">
              Compliance<span className="text-cc-purple bg-cc-gold">Core</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-sans text-cc-charcoal hover:text-cc-purple -ml-4 ${isActiveLink('/platform') ? 'cc-underline font-medium' : ''}`}>
                  Platform <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-white">
                <DropdownMenuItem>
                  <Link to="/platform/audit-management" className="w-full">Audit Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/document-control" className="w-full">Document Control</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/risk-assessment" className="w-full">Risk Assessment</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/platform/reporting" className="w-full">Reporting Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-sans text-cc-charcoal hover:text-cc-purple -ml-4 ${isActiveLink('/industries') ? 'cc-underline font-medium' : ''}`}>
                  Industries <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-white">
                <DropdownMenuItem>
                  <Link to="/industries/processed-foods" className="w-full">Processed Foods</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/dairy" className="w-full">Dairy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/meat-processing" className="w-full">Meat Processing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/industries/bakery" className="w-full">Bakery</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-sans text-cc-charcoal hover:text-cc-purple -ml-4 ${isActiveLink('/resources') ? 'cc-underline font-medium' : ''}`}>
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-white">
                <DropdownMenuItem>
                  <Link to="/resources/guides" className="w-full">Guides</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/blog" className="w-full">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/case-studies" className="w-full">Case Studies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/resources/webinars" className="w-full">Webinars</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-sans text-cc-charcoal hover:text-cc-purple -ml-4 ${isActiveLink('/integrations') ? 'cc-underline font-medium' : ''}`}>
                  Integrations <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-cc-white">
                <DropdownMenuItem>
                  <Link to="/integrations/erp" className="w-full">ERP Systems</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/integrations/lab-systems" className="w-full">Lab Systems</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/integrations/sensors" className="w-full">Sensor Networks</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/about" className={`font-sans text-cc-charcoal hover:text-cc-purple px-3 py-2 ${isActiveLink('/about') ? 'cc-underline font-medium' : ''}`}>
              About
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-sans text-cc-charcoal hover:text-cc-purple">
              Sign In
            </Link>
            <Link to="/demo">
              <Button className="bg-cc-purple hover:bg-cc-purple/90 text-white font-sans">
                Request Demo
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsNavOpen(!isNavOpen)}>
              {isNavOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isNavOpen && <div className="fixed inset-0 bg-cc-white z-40 pt-16 md:hidden">
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="py-2 border-b">
              <div className="text-lg font-display font-medium mb-1">Platform</div>
              <Link to="/platform/audit-management" className="block py-2 font-sans">
                Audit Management
              </Link>
              <Link to="/platform/document-control" className="block py-2 font-sans">
                Document Control
              </Link>
              <Link to="/platform/risk-assessment" className="block py-2 font-sans">
                Risk Assessment
              </Link>
              <Link to="/platform/reporting" className="block py-2 font-sans">
                Reporting Dashboard
              </Link>
            </div>
            
            <div className="py-2 border-b">
              <div className="text-lg font-display font-medium mb-1">Industries</div>
              <Link to="/industries/processed-foods" className="block py-2 font-sans">
                Processed Foods
              </Link>
              <Link to="/industries/dairy" className="block py-2 font-sans">
                Dairy
              </Link>
              <Link to="/industries/meat-processing" className="block py-2 font-sans">
                Meat Processing
              </Link>
              <Link to="/industries/bakery" className="block py-2 font-sans">
                Bakery
              </Link>
            </div>
            
            <div className="py-2 border-b">
              <div className="text-lg font-display font-medium mb-1">Resources</div>
              <Link to="/resources/guides" className="block py-2 font-sans">
                Guides
              </Link>
              <Link to="/resources/blog" className="block py-2 font-sans">
                Blog
              </Link>
              <Link to="/resources/case-studies" className="block py-2 font-sans">
                Case Studies
              </Link>
              <Link to="/resources/webinars" className="block py-2 font-sans">
                Webinars
              </Link>
            </div>
            
            <div className="py-2 border-b">
              <div className="text-lg font-display font-medium mb-1">Integrations</div>
              <Link to="/integrations/erp" className="block py-2 font-sans">
                ERP Systems
              </Link>
              <Link to="/integrations/lab-systems" className="block py-2 font-sans">
                Lab Systems
              </Link>
              <Link to="/integrations/sensors" className="block py-2 font-sans">
                Sensor Networks
              </Link>
            </div>
            
            <div className="py-2 border-b">
              <Link to="/about" className="block py-2 text-lg font-display font-medium">
                About
              </Link>
            </div>
            
            <div className="pt-4 mt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full mb-2 font-sans border-cc-purple text-cc-purple">
                  Sign In
                </Button>
              </Link>
              <Link to="/demo">
                <Button className="w-full bg-cc-purple hover:bg-cc-purple/90 text-white font-sans">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>}
    </nav>;
};
export default MainNavigation;