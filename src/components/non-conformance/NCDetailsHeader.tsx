
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NonConformance, NCStatus } from '@/types/non-conformance';
import NCStatusBadge from './NCStatusBadge';
import NCQuickActions from './NCQuickActions';

interface NCDetailsHeaderProps {
  nonConformance: NonConformance;
  onBackClick: () => void;
  onStatusChange: (status: NCStatus) => Promise<void>;
  onEdit: () => void;
  onViewCapa?: () => void;
  onCreateCapa: () => void;
}

const NCDetailsHeader: React.FC<NCDetailsHeaderProps> = ({
  nonConformance,
  onBackClick,
  onStatusChange,
  onEdit,
  onViewCapa,
  onCreateCapa
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="p-2 h-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg sm:text-2xl font-bold">{nonConformance?.title}</h2>
      </div>
      <div className="flex items-center space-x-2 self-end sm:self-auto mt-2 sm:mt-0">
        <NCStatusBadge status={nonConformance?.status || 'On Hold'} />
        <NCQuickActions 
          id={nonConformance?.id || ''}
          status={nonConformance?.status || 'On Hold'}
          onEdit={onEdit}
          onView={() => {}} // Already viewing, no action needed
          onStatusChange={onStatusChange}
          onCreateCAPA={onCreateCapa}
        />
      </div>
    </div>
  );
};

export default NCDetailsHeader;
