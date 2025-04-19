
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FacilityForm from '@/components/facilities/FacilityForm';
import { Facility } from '@/types/facility';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateFacilityDialogProps {
  organizationId: string;
  onFacilityCreated?: (facility: Facility) => void;
  trigger?: React.ReactNode;
}

const CreateFacilityDialog: React.FC<CreateFacilityDialogProps> = ({
  organizationId,
  onFacilityCreated,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = (facility: Facility) => {
    console.log('Facility created successfully in dialog:', facility);
    if (onFacilityCreated) {
      onFacilityCreated(facility);
    }
    toast({
      title: 'Success',
      description: `Facility "${facility.name}" has been created.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Facility
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        style={{
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto', // Enables scrolling if content overflows
        }}
        className="flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>Add Facility</DialogTitle>
          <DialogDescription>
            Add a new facility to this organization.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Area for Form */}
        <ScrollArea className="flex-1 overflow-y-auto pr-4 -mr-4">
          <FacilityForm 
            defaultValues={{ organization_id: organizationId, status: 'active' } as any}
            onSubmitSuccess={handleSuccess}
            isNewFacility={true}
            onCancel={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFacilityDialog;
