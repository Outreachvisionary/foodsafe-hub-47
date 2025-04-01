
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NCForm from '@/components/non-conformance/NCForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ProtectedSidebarLayout from '@/components/layout/ProtectedSidebarLayout';

const NonConformanceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('NonConformanceFormPage rendered with id:', id);
    console.log('Current location:', location.pathname);
  }, [id, location]);
  
  const formContent = (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
      
      <div className="bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-lg shadow-lg p-6">
        <NCForm 
          id={id} 
          onClose={() => navigate('/non-conformance')}
        />
      </div>
    </motion.div>
  );
  
  return (
    <ProtectedSidebarLayout>
      {formContent}
    </ProtectedSidebarLayout>
  );
};

export default NonConformanceFormPage;
