
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
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-xl font-display font-semibold text-fsms-dark mb-6 block">
              FoodSafe<span className="text-fsms-blue">Hub</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Streamlining food safety compliance for businesses around the world with an intuitive, comprehensive platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-fsms-blue transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fsms-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fsms-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fsms-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-fsms-dark mb-6">Standards</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/standards/sqf" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  SQF Compliance
                </Link>
              </li>
              <li>
                <Link to="/standards/iso22000" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  ISO 22000 Compliance
                </Link>
              </li>
              <li>
                <Link to="/standards/fssc22000" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  FSSC 22000 Compliance
                </Link>
              </li>
              <li>
                <Link to="/standards/haccp" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  HACCP Compliance
                </Link>
              </li>
              <li>
                <Link to="/standards/brcgs2" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  BRC GS2 Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-fsms-dark mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources/guides" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/templates" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/resources/webinars" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  Webinars
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-fsms-dark mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-fsms-blue mr-3 mt-0.5" />
                <span className="text-gray-600">
                  123 Food Safety Street<br />
                  Boston, MA 02110
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-fsms-blue mr-3" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-fsms-blue transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-fsms-blue mr-3" />
                <a href="mailto:info@foodsafehub.com" className="text-gray-600 hover:text-fsms-blue transition-colors">
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
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-fsms-blue text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-fsms-blue text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-fsms-blue text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
