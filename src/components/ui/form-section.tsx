
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  icon?: React.ReactNode;
}

// Export as both a named export and default export for compatibility
export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children, 
  className,
  collapsible = false,
  icon
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Card className={cn("mb-6", className)}>
      <CardHeader 
        className={cn("pb-3", collapsible && "cursor-pointer")}
        onClick={toggleCollapse}
      >
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            {title}
          </div>
          {collapsible && (
            isCollapsed ? 
              <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default FormSection;
