// Import statements and the rest of the code...
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { FacilityForm } from './FacilityForm';
import { Facility, CreateFacilityInput } from '@/types/organization';
import { useToast } from '@/hooks/use-toast';
import { createFacility } from '@/services/facilityService';

interface CreateFacilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onSubmitSuccess?: (facility: Facility) => void;
}

// Update the component to match the FacilityFormProps interface
const CreateFacilityDialog = ({ 
  isOpen, 
  onClose, 
  organizationId, 
  onSubmitSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Reference to the dialog to focus on the first input when opened
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Focus on the first input in the dialog
      const firstInput = dialogRef.current.querySelector('input, textarea, select');
      if (firstInput instanceof HTMLElement) {
        firstInput.focus();
      }
    }
  }, [isOpen]);

  const handleSubmit = async (data: Partial<Facility>) => {
    if (!organizationId) {
      toast({
        title: "Error",
        description: "Organization ID is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the facility with the organization ID
      const facilityData = {
        ...data,
        organization_id: organizationId,
      };

      // Call the API to create the facility
      const response = await createFacility(facilityData as CreateFacilityInput);

      toast({
        title: "Success",
        description: "Facility created successfully",
      });

      // Return the created facility to the parent component
      if (onSubmitSuccess) {
        onSubmitSuccess(response as Facility);
      }

      onClose();
    } catch (error) {
      console.error("Error creating facility:", error);
      toast({
        title: "Error",
        description: "Failed to create facility",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]" ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>Create New Facility</DialogTitle>
          <DialogDescription>
            Add a new facility to your organization. Fill out the form below with the facility details.
          </DialogDescription>
        </DialogHeader>
        
        <FacilityForm 
          onSubmit={handleSubmit} 
          isLoading={false} 
          initialData={{
            organization_id: organizationId,
            status: 'Active'
          }}
          onCancel={onClose}
          isNewFacility={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFacilityDialog;
