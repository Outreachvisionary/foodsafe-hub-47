
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
        className="flex h-16 items-center px-4 border-b"
        {...props}
      >
        <div className="flex-1">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-10 pr-4"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="ml-4 flex items-center gap-4">
            <span className="text-sm font-medium">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              AU
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TopNav.displayName = "TopNav";

export default TopNav;
