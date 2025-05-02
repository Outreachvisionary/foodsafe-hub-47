
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

  const handleSubmit = (data: Partial<Facility>) => {
    // This is a mock implementation - in a real app, you'd call an API to create the facility
    console.log('Creating facility with data:', data);
    const mockFacility: Facility = {
      id: Date.now().toString(),
      organization_id: organizationId,
      name: data.name || 'New Facility',
      description: data.description,
      address: data.address,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      status: data.status || 'active',
      country: data.country,
      state: data.state,
      city: data.city,
      zipcode: data.zipcode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      facility_type: data.facility_type
    };
    
    handleSuccess(mockFacility);
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
            onSubmit={handleSubmit}
            isLoading={false}
            initialData={{ 
              organization_id: organizationId, 
              status: 'active' 
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFacilityDialog;
