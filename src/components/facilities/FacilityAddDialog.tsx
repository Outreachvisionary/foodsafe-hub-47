
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import FacilityForm from './FacilityForm';
import { Facility } from '@/types/facility';

interface FacilityAddDialogProps {
  organizationId: string;
  onFacilityAdded: (facility: Facility) => void;
}

const FacilityAddDialog: React.FC<FacilityAddDialogProps> = ({ organizationId, onFacilityAdded }) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmitSuccess = (facility: Facility) => {
    onFacilityAdded(facility);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Facility</DialogTitle>
        </DialogHeader>
        <FacilityForm 
          onSubmitSuccess={handleSubmitSuccess} 
          defaultValues={{ organization_id: organizationId, status: 'active' } as any}
          isNewFacility={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FacilityAddDialog;
