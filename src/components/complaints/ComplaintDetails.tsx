import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateCAPADialog from '@/components/capa/CreateCAPADialog';

const ComplaintDetails = ({ complaint }) => {
  const [showCAPADialog, setShowCAPADialog] = useState(false);
  
  const handleCAPACreated = (capaData) => {
    console.log('CAPA created:', capaData);
    // Handle the newly created CAPA
    // For example, update UI, show notification, etc.
  };
  
  return (
    <div>
      <h2>Complaint Details</h2>
      
      {/* Display complaint details */}
      
      {/* Use the CreateCAPADialog with trigger */}
      <CreateCAPADialog
        onCAPACreated={handleCAPACreated}
        initialData={{
          title: complaint?.title,
          description: complaint?.description,
          source: 'complaint',
          sourceId: complaint?.id,
          priority: complaint?.priority || 'medium'
        }}
        trigger={
          <Button>Create CAPA from Complaint</Button>
        }
      />
    </div>
  );
};

export default ComplaintDetails;
