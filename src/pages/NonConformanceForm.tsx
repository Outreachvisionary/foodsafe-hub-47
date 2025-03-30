
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NCForm from '@/components/non-conformance/NCForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NonConformanceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {id ? 'Edit Non-Conformance' : 'New Non-Conformance'}
        </h1>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/non-conformance')}
          className="hover:border-accent hover:text-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
      
      <div className="bg-gradient-to-br from-white to-accent/5 border border-border/60 rounded-lg shadow-md p-6">
        <NCForm 
          id={id} 
          onClose={() => navigate('/non-conformance')}
        />
      </div>
    </div>
  );
};

export default NonConformanceFormPage;
