
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  current: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // Skip rendering breadcrumbs on the dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }
  
  // Function to generate breadcrumb items from the current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let accumulatedPath = '';
    
    // Start with Dashboard
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        path: '/dashboard',
        current: false
      }
    ];
    
    // Add path segments
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      
      // Format the label (capitalize, replace hyphens with spaces)
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: accumulatedPath,
        current: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/60 mr-2" />
            )}
            {breadcrumb.current ? (
              <span className="text-foreground font-medium">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
