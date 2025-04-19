
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCAPA } from '@/services/capaService';
import { useAuth } from '@/hooks/useAuth';

interface CreateCAPADialogProps {
  onCAPACreated: (data: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    source?: string;
    sourceId?: string;
    priority?: string;
  };
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  onCAPACreated,
  initialData
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // This would be a more elaborate form in a real implementation
  const handleSubmitCAPA = async () => {
    setLoading(true);
    try {
      const capaData = {
        title: initialData?.title || 'New CAPA',
        description: initialData?.description || '',
        source: initialData?.source || 'internal',
        sourceId: initialData?.sourceId || null,
        priority: initialData?.priority || 'medium',
        status: 'open',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        assignedTo: user?.id || 'system',
        createdBy: user?.id || 'system',
        effectivenessVerified: false,
        isFsma204Compliant: false
      };

      const result = await createCAPA(capaData);
      onCAPACreated(result);
    } catch (error) {
      console.error('Error creating CAPA:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-medium">Create CAPA</h2>
      <p className="text-sm text-gray-500">
        Create a Corrective and Preventive Action from{' '}
        {initialData?.source || 'scratch'}
      </p>
      
      {/* In a real implementation, this would be a full form with fields for all CAPA properties */}
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <div className="border p-2 rounded-md bg-gray-50">
            {initialData?.title || 'New CAPA'}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="border p-2 rounded-md bg-gray-50 min-h-[60px]">
            {initialData?.description || 'No description provided'}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCAPA}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create CAPA'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCAPADialog;
