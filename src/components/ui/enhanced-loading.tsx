
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="text-center space-y-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

interface SkeletonLoadingProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  lines = 3,
  className
}) => {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-gray-200 rounded',
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  children,
  loadingComponent,
  errorComponent,
  className
}) => {
  if (error && errorComponent) {
    return <>{errorComponent}</>;
  }

  if (error) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    
    return (
      <div className={cn('text-center py-8', className)}>
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};
