
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FacilityForm from './FacilityForm';
import { Facility } from '@/types/facility';

interface FacilityAddDialogProps {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFacilityCreated: (facility: Facility) => void;
}

const FacilityAddDialog: React.FC<FacilityAddDialogProps> = ({ 
  organizationId, 
  open, 
  onOpenChange, 
  onFacilityCreated 
}) => {
  const handleSubmitSuccess = (facility: Facility) => {
    onFacilityCreated(facility);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Facility</DialogTitle>
        </DialogHeader>
        <FacilityForm 
          onSubmitSuccess={handleSubmitSuccess} 
          defaultValues={{ organization_id: organizationId, status: 'active' } as any}
          isNewFacility={true}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FacilityAddDialog;
