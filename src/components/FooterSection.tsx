import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
const FooterSection = () => {
  return <footer className="bg-cc-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="border-b border-cc-purple/10 pb-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-1">
              <Link to="/" className="text-xl font-display font-bold text-cc-charcoal inline-block mb-4">
                Compliance<span className="text-cc-purple">Core</span>
              </Link>
              <p className="text-cc-charcoal/70 mb-6 font-sans">
                Elevate Food Safety Standards Across Operations
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-cc-charcoal hover:text-cc-purple transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-cc-charcoal hover:text-cc-purple transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-cc-charcoal hover:text-cc-purple transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-cc-charcoal hover:text-cc-purple transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-display font-semibold text-cc-charcoal mb-4">Platform</h3>
              <ul className="space-y-2 font-sans">
                <li><Link to="/platform/audit-management" className="text-cc-charcoal/70 hover:text-cc-purple">Audit Management</Link></li>
                <li><Link to="/platform/document-control" className="text-cc-charcoal/70 hover:text-cc-purple">Document Control</Link></li>
                <li><Link to="/platform/risk-assessment" className="text-cc-charcoal/70 hover:text-cc-purple">Risk Assessment</Link></li>
                <li><Link to="/platform/multi-facility" className="text-cc-charcoal/70 hover:text-cc-purple">Multi-facility Management</Link></li>
                <li><Link to="/platform/reporting" className="text-cc-charcoal/70 hover:text-cc-purple">Reporting Dashboard</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-display font-semibold text-cc-charcoal mb-4">Resources</h3>
              <ul className="space-y-2 font-sans">
                <li><Link to="/resources/guides" className="text-cc-charcoal/70 hover:text-cc-purple">Guides</Link></li>
                <li><Link to="/resources/blog" className="text-cc-charcoal/70 hover:text-cc-purple">Blog</Link></li>
                <li><Link to="/resources/case-studies" className="text-cc-charcoal/70 hover:text-cc-purple">Case Studies</Link></li>
                <li><Link to="/resources/webinars" className="text-cc-charcoal/70 hover:text-cc-purple">Webinars</Link></li>
                <li><Link to="/resources/white-papers" className="text-cc-charcoal/70 hover:text-cc-purple">White Papers</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-display font-semibold text-cc-charcoal mb-4">Subscribe</h3>
              <p className="text-cc-charcoal/70 mb-4 font-sans">
                Stay updated with the latest in food safety compliance.
              </p>
              <div className="flex bg-cc-white">
                <Input type="email" placeholder="Your email" className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-cc-teal" />
                <Button className="rounded-l-none bg-cc-tagline">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center font-sans">
          <div className="text-cc-charcoal/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Compliance Core. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-cc-charcoal/60 hover:text-cc-purple">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-cc-charcoal/60 hover:text-cc-purple">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-cc-charcoal/60 hover:text-cc-purple">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default FooterSection;