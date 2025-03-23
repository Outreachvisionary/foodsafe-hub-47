
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CAPAForm from './CAPAForm';
import { useToast } from '@/components/ui/use-toast';

interface CreateCAPADialogProps {
  onCAPACreated?: (data: any) => void;
  trigger?: React.ReactNode;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ 
  onCAPACreated,
  trigger 
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log('New CAPA data:', data);
    
    // Here we would normally send this to an API
    // For now we'll just simulate success and call the callback
    
    if (onCAPACreated) {
      onCAPACreated(data);
    }
    
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            New CAPA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
          <DialogDescription>
            Define a new Corrective and Preventive Action plan
          </DialogDescription>
        </DialogHeader>
        <CAPAForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
