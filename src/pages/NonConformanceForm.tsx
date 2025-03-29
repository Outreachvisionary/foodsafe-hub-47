import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NCForm from '@/components/non-conformance/NCForm';

const NonConformanceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {id ? 'Edit Non-Conformance' : 'New Non-Conformance'}
      </h1>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <NCForm 
          id={id} 
          onClose={() => navigate('/non-conformance')}
        />
      </div>
    </div>
  );
};

export default NonConformanceFormPage;
