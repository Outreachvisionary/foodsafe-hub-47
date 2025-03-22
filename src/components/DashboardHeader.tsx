
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Search,
  HelpCircle
} from 'lucide-react';

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
};

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-fsms-dark">{title}</h1>
            {subtitle && (
              <p className="text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-fsms-blue/20 focus:border-fsms-blue w-64 transition-all"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-fsms-blue"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-fsms-blue/10 flex items-center justify-center text-fsms-blue mr-2">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block mr-2">
                <div className="text-sm font-medium text-fsms-dark">John Doe</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
