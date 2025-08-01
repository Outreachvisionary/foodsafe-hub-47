
import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TopNav = React.forwardRef<HTMLDivElement, TopNavProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="flex h-16 items-center px-6 border-b bg-card/80 backdrop-blur-sm border-border/50"
        {...props}
      >
        <div className="flex-1">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search across all modules..."
              className="w-full bg-background/60 border-border/40 pl-10 pr-4 h-10 rounded-lg"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">2</span>
            </div>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="ml-6 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-medium text-white">
              AU
            </div>
            <span className="text-sm font-medium text-foreground">Admin User</span>
          </div>
        </div>
      </div>
    );
  }
);
TopNav.displayName = "TopNav";

export default TopNav;
