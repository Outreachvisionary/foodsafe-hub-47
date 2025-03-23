
import React from 'react';
import { TestTube2, AlertTriangle, Sparkles, Banana } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FoodHazardType } from '@/hooks/useAuditTraining';

interface HazardTypeIconsProps {
  hazardTypes?: FoodHazardType[];
}

const HazardTypeIcons: React.FC<HazardTypeIconsProps> = ({ hazardTypes }) => {
  if (!hazardTypes || hazardTypes.length === 0) return null;
  
  return (
    <div className="flex space-x-1">
      <TooltipProvider>
        {hazardTypes.includes('biological') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span><TestTube2 className="h-4 w-4 text-green-600" /></span>
            </TooltipTrigger>
            <TooltipContent>Biological</TooltipContent>
          </Tooltip>
        )}
        {hazardTypes.includes('chemical') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span><AlertTriangle className="h-4 w-4 text-orange-600" /></span>
            </TooltipTrigger>
            <TooltipContent>Chemical</TooltipContent>
          </Tooltip>
        )}
        {hazardTypes.includes('physical') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span><Sparkles className="h-4 w-4 text-blue-600" /></span>
            </TooltipTrigger>
            <TooltipContent>Physical</TooltipContent>
          </Tooltip>
        )}
        {hazardTypes.includes('allergen') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span><Banana className="h-4 w-4 text-yellow-600" /></span>
            </TooltipTrigger>
            <TooltipContent>Allergen</TooltipContent>
          </Tooltip>
        )}
        {hazardTypes.includes('radiological') && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span><AlertTriangle className="h-4 w-4 text-purple-600" /></span>
            </TooltipTrigger>
            <TooltipContent>Radiological</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default HazardTypeIcons;
