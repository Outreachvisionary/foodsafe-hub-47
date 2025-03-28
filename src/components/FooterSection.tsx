
import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-brand-darkGray">FoodSafeSync</span>
            </Link>
            <p className="text-brand-darkGray/70 mb-4 max-w-xs">
              Enterprise food safety compliance platform tailored for manufacturing excellence.
            </p>
            <div className="text-sm text-brand-darkGray/70">
              <p>
                123 Compliance Way, Suite 500<br />
                Chicago, IL 60601
              </p>
              <p className="mt-2">
                <a href="tel:+18005551234" className="hover:text-brand-teal">+1 (800) 555-1234</a><br />
                <a href="mailto:info@foodsafesync.com" className="hover:text-brand-teal">info@foodsafesync.com</a>
              </p>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-brand-darkGray mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/audit-management" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Audit Management
                </Link>
              </li>
              <li>
                <Link to="/products/document-control" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Document Control
                </Link>
              </li>
              <li>
                <Link to="/products/supplier-compliance" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Supplier Compliance
                </Link>
              </li>
              <li>
                <Link to="/products/analytics" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Analytics & Reporting
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Solutions Links */}
          <div>
            <h3 className="font-semibold text-brand-darkGray mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions/processed-foods" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Processed Foods
                </Link>
              </li>
              <li>
                <Link to="/solutions/dairy" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Dairy
                </Link>
              </li>
              <li>
                <Link to="/solutions/meat-processing" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Meat Processing
                </Link>
              </li>
              <li>
                <Link to="/solutions/bakery" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Bakery & Confectionery
                </Link>
              </li>
              <li>
                <Link to="/solutions/beverages" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Beverages
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-brand-darkGray mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/company/about" className="text-brand-darkGray/70 hover:text-brand-teal">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/resources/blog" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/company/careers" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/company/contact" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/company/partners" className="text-brand-darkGray/70 hover:text-brand-teal">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social proof & Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-brand-darkGray/60">
              © {new Date().getFullYear()} FoodSafeSync. All rights reserved.
            </div>
            <div className="text-sm text-brand-darkGray/60 mt-1">
              <Link to="/privacy" className="hover:text-brand-teal">Privacy Policy</Link> • 
              <Link to="/terms" className="hover:text-brand-teal ml-2">Terms of Service</Link>
            </div>
          </div>
          
          <div className="text-sm text-brand-darkGray/60">
            Featured in: <span className="font-medium">Food Safety Magazine</span> • <span className="font-medium">Forbes</span> • <span className="font-medium">Food Processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
