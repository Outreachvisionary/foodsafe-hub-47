
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export function FormSection({ 
  title, 
  children, 
  collapsible = false, 
  defaultCollapsed = false,
  className = ""
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`mb-8 ${className}`}>
      <div className={`flex items-center justify-between mb-4 ${collapsible ? "cursor-pointer" : ""}`}
           onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}>
        <h3 className="text-lg font-medium">{title}</h3>
        {collapsible && (
          <div className="text-gray-500">
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
        )}
      </div>
      <div className={isCollapsed ? "hidden" : ""}>
        {children}
      </div>
    </div>
  );
}

export default FormSection;
