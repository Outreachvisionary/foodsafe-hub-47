
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F5F5F5] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-xl font-playfair font-semibold text-[#1A2B3C] mb-6 block">
              Food<span className="text-[#D4AF37]">Safe</span>Hub
            </Link>
            <p className="text-gray-600 mb-6">
              Enterprise-grade food safety compliance for industry leaders.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#1A2B3C] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1A2B3C] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1A2B3C] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1A2B3C] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#1A2B3C] mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#1A2B3C] mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/whitepapers" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Whitepapers
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/webinars" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-[#1A2B3C] mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D4AF37] mr-3 mt-0.5" />
                <span className="text-gray-600">
                  123 Food Safety Street<br />
                  Boston, MA 02110
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#D4AF37] mr-3" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#D4AF37] mr-3" />
                <a href="mailto:info@foodsafehub.com" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  info@foodsafehub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FoodSafeHub. All rights reserved.
            </p>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="text-sm text-gray-500">
                Featured in <span className="font-medium">Forbes, Food Safety Magazine</span>
              </div>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
