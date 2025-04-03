
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
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-accent to-accent-light rounded-md p-1.5">
                <span className="text-white font-bold">CC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Compliance Core
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`font-medium -ml-4 ${isActiveLink('/platform') ? 'text-accent animated-underline' : 'text-foreground hover:text-accent'}`}>
                  Platform <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                <Button variant="ghost" className={`font-medium -ml-4 ${isActiveLink('/industries') ? 'text-accent animated-underline' : 'text-foreground hover:text-accent'}`}>
                  Industries <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                <Button variant="ghost" className={`font-medium -ml-4 ${isActiveLink('/resources') ? 'text-accent animated-underline' : 'text-foreground hover:text-accent'}`}>
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
            
            <Link to="/about" className={`font-medium px-3 py-2 ${isActiveLink('/about') ? 'text-accent animated-underline' : 'text-foreground hover:text-accent'}`}>
              About
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="font-medium text-foreground hover:text-accent animated-underline">
              Sign In
            </Link>
            <Link to="/demo">
              <Button className="bg-gradient-to-r from-accent to-accent-dark hover:opacity-90 text-white">
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
      {isNavOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 md:hidden">
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="py-2 border-b border-border/60">
              <div className="text-lg font-medium mb-1 text-accent">Platform</div>
              <Link to="/platform/audit-management" className="block py-2 hover:text-accent">
                Audit Management
              </Link>
              <Link to="/platform/document-control" className="block py-2 hover:text-accent">
                Document Control
              </Link>
              <Link to="/platform/risk-assessment" className="block py-2 hover:text-accent">
                Risk Assessment
              </Link>
              <Link to="/platform/reporting" className="block py-2 hover:text-accent">
                Reporting Dashboard
              </Link>
            </div>
            
            <div className="py-2 border-b border-border/60">
              <div className="text-lg font-medium mb-1 text-accent">Industries</div>
              <Link to="/industries/processed-foods" className="block py-2 hover:text-accent">
                Processed Foods
              </Link>
              <Link to="/industries/dairy" className="block py-2 hover:text-accent">
                Dairy
              </Link>
              <Link to="/industries/meat-processing" className="block py-2 hover:text-accent">
                Meat Processing
              </Link>
              <Link to="/industries/bakery" className="block py-2 hover:text-accent">
                Bakery
              </Link>
            </div>
            
            <div className="py-2 border-b border-border/60">
              <div className="text-lg font-medium mb-1 text-accent">Resources</div>
              <Link to="/resources/guides" className="block py-2 hover:text-accent">
                Guides
              </Link>
              <Link to="/resources/blog" className="block py-2 hover:text-accent">
                Blog
              </Link>
              <Link to="/resources/case-studies" className="block py-2 hover:text-accent">
                Case Studies
              </Link>
              <Link to="/resources/webinars" className="block py-2 hover:text-accent">
                Webinars
              </Link>
            </div>
            
            <div className="py-2 border-b border-border/60">
              <Link to="/about" className="block py-2 text-lg font-medium hover:text-accent">
                About
              </Link>
            </div>
            
            <div className="pt-4 mt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full mb-2 border-accent text-accent hover:bg-accent/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/demo">
                <Button className="w-full bg-gradient-to-r from-accent to-accent-dark hover:opacity-90 text-white">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
