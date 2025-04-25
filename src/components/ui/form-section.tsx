
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  collapsible?: boolean;
  icon?: LucideIcon;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  className,
  description,
  collapsible = false,
  icon: Icon,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Card className={cn("mb-6 border shadow-sm", className)}>
      <CardHeader 
        className={cn(
          "py-4 bg-card-hover/50", 
          collapsible && "cursor-pointer"
        )}
        onClick={toggleCollapse}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          {collapsible && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed);
              }} 
              className="text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 2.5C7 2.22386 7.22386 2 7.5 2Z" fill="currentColor" />
                  <path d="M2.5 7C2.22386 7 2 7.22386 2 7.5C2 7.77614 2.22386 8 2.5 8L12.5 8C12.7761 8 13 7.77614 13 7.5C13 7.22386 12.7761 7 12.5 7L2.5 7Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path d="M2.5 7C2.22386 7 2 7.22386 2 7.5C2 7.77614 2.22386 8 2.5 8H12.5C12.7761 8 13 7.77614 13 7.5C13 7.22386 12.7761 7 12.5 7H2.5Z" fill="currentColor" />
                </svg>
              )}
            </button>
          )}
        </div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
};
