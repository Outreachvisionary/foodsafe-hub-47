import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { createCAPA } from '@/services/capaService';
import { useAuth } from '@/hooks/useAuth';
import { CAPASource, CAPAPriority, CAPAStatus } from '@/types/capa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InitialData {
  title?: string;
  description?: string;
  source?: CAPASource;
  sourceId?: string;
  priority?: CAPAPriority;
}

interface CreateCAPADialogProps {
  onCAPACreated: (capa: any) => void;
  initialData?: InitialData;
  children?: ReactNode;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  onCAPACreated,
  initialData,
  children
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmitCAPA = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      const capaData = {
        title: initialData?.title || 'New CAPA',
        description: initialData?.description || '',
        source: (initialData?.source as CAPASource) || 'other',
        sourceId: initialData?.sourceId || '',
        priority: initialData?.priority || 'medium',
        status: 'open' as CAPAStatus,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: user?.id || 'system',
        createdBy: user?.id || 'system',
        createdDate: now,
        lastUpdated: now,
        effectivenessVerified: false,
        isFsma204Compliant: false
      };
      
      const result = await createCAPA(capaData);
      onCAPACreated(result);
      setOpen(false);
    } catch (error) {
      console.error('Error creating CAPA:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary-dark text-white">
            Create CAPA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">Create CAPA</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <p className="text-sm text-muted-foreground">
            Create a Corrective and Preventive Action from {initialData?.source || 'scratch'}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
              <div className="rounded-lg bg-card p-3 border shadow-sm">
                {initialData?.title || 'New CAPA'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
              <div className="rounded-lg bg-card p-3 border shadow-sm min-h-[60px]">
                {initialData?.description || 'No description provided'}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitCAPA}
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {loading ? 'Creating...' : 'Create CAPA'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
