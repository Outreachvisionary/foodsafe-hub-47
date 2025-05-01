
import * as React from "react";
import { cn } from "@/lib/utils";

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    {...props}
  />
));
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative pl-8", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-2.5 top-10 h-[calc(100%-40px)] w-[1px] bg-border",
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

const TimelineIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background z-10",
      className
    )}
    {...props}
  />
));
TimelineIcon.displayName = "TimelineIcon";

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start mb-2", className)}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

const TimelineBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-2 pb-4", className)}
    {...props}
  />
));
TimelineBody.displayName = "TimelineBody";

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineHeader,
  TimelineBody,
};
