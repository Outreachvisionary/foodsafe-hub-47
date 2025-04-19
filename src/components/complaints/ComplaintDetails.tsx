
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';
import { useToast } from '@/components/ui/use-toast';

interface ComplaintDetailsProps {
  complaint: any; // Replace with proper type
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCAPACreated = (capaData: any) => {
    toast({
      title: "CAPA Created",
      description: `CAPA ${capaData.id} created successfully`,
    });
    // Additional logic after CAPA creation
  };

  // Source data to pass to CreateCAPADialog
  const sourceData = {
    title: complaint.title,
    description: complaint.description,
    source: "complaint",
    sourceId: complaint.id,
    priority: complaint.severity || 'medium'
  };

  return (
    <div>
      {/* Complaint details display */}
      <div className="space-y-4">
        {/* ... complaint details ... */}
      </div>

      {/* CAPA Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="text-blue-600 hover:underline">Create CAPA from this complaint</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <CreateCAPADialog
            onCAPACreated={handleCAPACreated}
            initialData={sourceData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintDetails;
