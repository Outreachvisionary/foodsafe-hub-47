
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  numCols?: number;
  numColsSm?: number;
  numColsMd?: number;
  numColsLg?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  numCols = 1,
  numColsSm,
  numColsMd,
  numColsLg,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        numCols === 1 && 'grid-cols-1',
        numCols === 2 && 'grid-cols-2',
        numCols === 3 && 'grid-cols-3',
        numCols === 4 && 'grid-cols-4',
        numCols === 5 && 'grid-cols-5',
        numCols === 6 && 'grid-cols-6',
        numColsSm === 1 && 'sm:grid-cols-1',
        numColsSm === 2 && 'sm:grid-cols-2',
        numColsSm === 3 && 'sm:grid-cols-3',
        numColsSm === 4 && 'sm:grid-cols-4',
        numColsSm === 5 && 'sm:grid-cols-5',
        numColsSm === 6 && 'sm:grid-cols-6',
        numColsMd === 1 && 'md:grid-cols-1',
        numColsMd === 2 && 'md:grid-cols-2',
        numColsMd === 3 && 'md:grid-cols-3',
        numColsMd === 4 && 'md:grid-cols-4',
        numColsMd === 5 && 'md:grid-cols-5',
        numColsMd === 6 && 'md:grid-cols-6',
        numColsLg === 1 && 'lg:grid-cols-1',
        numColsLg === 2 && 'lg:grid-cols-2',
        numColsLg === 3 && 'lg:grid-cols-3',
        numColsLg === 4 && 'lg:grid-cols-4',
        numColsLg === 5 && 'lg:grid-cols-5',
        numColsLg === 6 && 'lg:grid-cols-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const GridItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn(className)}>{children}</div>;
};
