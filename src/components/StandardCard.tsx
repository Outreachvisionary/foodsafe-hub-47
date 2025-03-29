
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StandardCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  index?: number;
};

const StandardCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  className,
  index = 0
}: StandardCardProps) => {
  // Extract standard ID from href (e.g., /standards/sqf -> sqf)
  const standardId = href.split('/').pop();
  
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden card-hover-effect animate-fade-up",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-fsms-lightBlue text-fsms-blue mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={href} className="w-full">
            <Button 
              variant="outline" 
              className="group w-full flex items-center justify-center space-x-2 border-fsms-blue/20 text-fsms-blue hover:bg-fsms-blue hover:text-white"
            >
              <span>View Standard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to={`/standards-modules/${standardId}`} className="w-full">
            <Button 
              variant="outline" 
              className="group w-full flex items-center justify-center space-x-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white"
            >
              <span>Modules</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StandardCard;
