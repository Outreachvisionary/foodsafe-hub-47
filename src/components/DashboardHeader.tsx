
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User, ChevronDown, Search, HelpCircle } from 'lucide-react';

type DashboardHeaderProps = {
  title: string | ReactNode;
  subtitle?: string;
};

const DashboardHeader = ({
  title,
  subtitle
}: DashboardHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-background via-accent/5 to-background border-b border-border/60 sm:px-6 lg:px-8 py-4 px-[9px] mx-0 my-0 shadow-md rounded-b-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
              {title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 text-accent">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              </Button>
              
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-primary">
                <Settings className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center pl-4 border-l border-border/60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white mr-2 shadow-md">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block mr-2">
                  <div className="text-sm font-medium text-foreground">John Doe</div>
                  <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {subtitle && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground pr-4">{subtitle}</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full text-sm border border-border/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white/80 backdrop-blur-sm w-64 transition-all shadow-sm" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
