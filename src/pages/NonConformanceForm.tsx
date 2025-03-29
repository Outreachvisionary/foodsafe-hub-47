
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import NCForm from '@/components/non-conformance/NCForm';

const NonConformanceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <SidebarLayout>
      <div className="p-6">
        <NCForm 
          id={id} 
          onClose={() => navigate('/non-conformance')}
        />
      </div>
    </SidebarLayout>
  );
};

export default NonConformanceFormPage;
