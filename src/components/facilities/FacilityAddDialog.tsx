
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Facility } from '@/types/facility';
import FacilityForm from './FacilityForm';
import { supabase } from '@/integrations/supabase/client';

interface FacilityAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (facility: Facility) => void;
  initialData?: Partial<Facility>;
}

const FacilityAddDialog: React.FC<FacilityAddDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = {},
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNewFacility = !initialData.id;

  const handleSubmit = async (data: Partial<Facility>) => {
    setIsLoading(true);
    try {
      let result;
      
      if (isNewFacility) {
        // Create new facility
        const { data: newFacility, error } = await supabase
          .from('facilities')
          .insert({
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) throw error;
        result = newFacility;
        
        toast({
          title: "Facility Created",
          description: "The facility has been successfully created.",
        });
      } else {
        // Update existing facility
        const { data: updatedFacility, error } = await supabase
          .from('facilities')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = updatedFacility;
        
        toast({
          title: "Facility Updated",
          description: "The facility has been successfully updated.",
        });
      }
      
      onSuccess(result as Facility);
      onClose();
    } catch (error: any) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save facility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewFacility ? 'Add New Facility' : 'Edit Facility'}</DialogTitle>
          <DialogDescription>
            {isNewFacility
              ? 'Create a new facility to manage in the system.'
              : 'Update the facility details and information.'}
          </DialogDescription>
        </DialogHeader>
        
        <FacilityForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FacilityAddDialog;
