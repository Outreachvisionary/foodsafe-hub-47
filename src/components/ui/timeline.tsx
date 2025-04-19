
import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  title: React.ReactNode;
  date?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  date,
  icon,
  children,
  isLast = false,
  className,
}) => {
  return (
    <div className={cn("relative flex gap-4", className)}>
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background z-10">
          {icon}
        </div>
        {!isLast && <div className="h-full w-px bg-border -mt-2"></div>}
      </div>
      <div className={cn("pb-8", isLast && "pb-0")}>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {date && <span className="text-sm text-muted-foreground">{date}</span>}
          </div>
          {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
        </div>
      </div>
    </div>
  );
};

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

// Additional components for backward compatibility
export const TimelineContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <div className="mt-1 text-sm text-muted-foreground">{children}</div>;
};

export const TimelineSeparator: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <div className="flex flex-col items-center">{children}</div>;
};

export const TimelineDot: React.FC<{color?: string; className?: string}> = ({ 
  color = "primary", 
  className 
}) => {
  return (
    <div className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full border bg-background z-10",
      color === "primary" && "border-primary",
      className
    )}/>
  );
};

export const TimelineConnector: React.FC<{className?: string}> = ({ className }) => {
  return <div className={cn("h-full w-px bg-border -mt-2", className)}/>;
};
