
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import LanguageSelector from '@/components/LanguageSelector';

const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-fsms-blue">
              CompliancePro
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/standards" className="text-gray-600 hover:text-fsms-blue">
              Standards
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-fsms-blue">
              Features
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-fsms-blue -ml-4">
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/documentation" className="w-full">Documentation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/guides" className="w-full">Guides</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/templates" className="w-full">Templates</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/pricing" className="text-gray-600 hover:text-fsms-blue">
              Pricing
            </Link>
            <div className="ml-4">
              <LanguageSelector />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline" className="border-fsms-blue text-fsms-blue" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" className="border-fsms-blue text-fsms-blue" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button variant="outline" className="border-fsms-blue text-fsms-blue">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button className="bg-fsms-blue hover:bg-fsms-blue/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
            <Link to="/standards" className="block py-2 text-lg" onClick={() => setIsNavOpen(false)}>
              Standards
            </Link>
            <Link to="/features" className="block py-2 text-lg" onClick={() => setIsNavOpen(false)}>
              Features
            </Link>
            <Link to="/documentation" className="block py-2 text-lg" onClick={() => setIsNavOpen(false)}>
              Documentation
            </Link>
            <Link to="/guides" className="block py-2 text-lg" onClick={() => setIsNavOpen(false)}>
              Guides
            </Link>
            <Link to="/pricing" className="block py-2 text-lg" onClick={() => setIsNavOpen(false)}>
              Pricing
            </Link>
            
            <div className="pt-4 mt-4 border-t">
              {user ? (
                <>
                  <Button className="w-full mb-2" onClick={() => { navigate('/dashboard'); setIsNavOpen(false); }}>
                    Dashboard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { handleSignOut(); setIsNavOpen(false); }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=login" onClick={() => setIsNavOpen(false)}>
                    <Button variant="outline" className="w-full mb-2">Sign In</Button>
                  </Link>
                  <Link to="/auth?mode=register" onClick={() => setIsNavOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="pt-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
