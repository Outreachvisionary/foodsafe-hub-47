
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';

const MainNavigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-brand-darkGray">
              FoodSafeSync
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-brand-darkGray hover:text-brand-teal -ml-4">
                  Products <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/products/audit-management" className="w-full">Audit Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/products/document-control" className="w-full">Document Control</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/products/supplier-compliance" className="w-full">Supplier Compliance</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-brand-darkGray hover:text-brand-teal -ml-4">
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/solutions/processed-foods" className="w-full">Processed Foods</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/solutions/dairy" className="w-full">Dairy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/solutions/meat-processing" className="w-full">Meat Processing</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-brand-darkGray hover:text-brand-teal -ml-4">
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
                  <Link to="/resources/webinars" className="w-full">Webinars</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-brand-darkGray hover:text-brand-teal -ml-4">
                  Integrations <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-brand-darkGray hover:text-brand-teal -ml-4">
                  Company <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/company/about" className="w-full">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/company/careers" className="w-full">Careers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/company/contact" className="w-full">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-brand-darkGray hover:text-brand-teal">
              Login
            </Link>
            <Link to="/demo">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                Book a free demo
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
          <div className="p-4 space-y-4">
            <Link to="/products" className="block py-2 text-lg font-medium" onClick={() => setIsNavOpen(false)}>
              Products
            </Link>
            <Link to="/solutions" className="block py-2 text-lg font-medium" onClick={() => setIsNavOpen(false)}>
              Solutions
            </Link>
            <Link to="/resources" className="block py-2 text-lg font-medium" onClick={() => setIsNavOpen(false)}>
              Resources
            </Link>
            <Link to="/integrations" className="block py-2 text-lg font-medium" onClick={() => setIsNavOpen(false)}>
              Integrations
            </Link>
            <Link to="/company" className="block py-2 text-lg font-medium" onClick={() => setIsNavOpen(false)}>
              Company
            </Link>
            
            <div className="pt-4 mt-4 border-t">
              <Link to="/login" onClick={() => setIsNavOpen(false)}>
                <Button variant="outline" className="w-full mb-2">Login</Button>
              </Link>
              <Link to="/demo" onClick={() => setIsNavOpen(false)}>
                <Button className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white">Book a free demo</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
