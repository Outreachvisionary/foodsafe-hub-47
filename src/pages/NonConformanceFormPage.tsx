
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NCCreateForm from '@/components/non-conformance/NCCreateForm';
import NCEditForm from '@/components/non-conformance/NCEditForm';
import { useNonConformance } from '@/hooks/useNonConformance';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const NonConformanceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: nonConformance, isLoading, error } = useNonConformance(id || '');
  
  useEffect(() => {
    console.log('NonConformanceFormPage rendered with id:', id);
    console.log('Current location:', location.pathname);
  }, [id, location]);
  
  const handleBackToList = () => {
    console.log('Navigating back to non-conformance list');
    navigate('/non-conformance');
  };

  const handleSave = () => {
    navigate('/non-conformance');
  };

  const isEditMode = !!id;
  
  if (isEditMode && isLoading) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading non-conformance data...</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isEditMode && error) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading non-conformance: {String(error)}
              <Button onClick={handleBackToList} className="mt-4 block mx-auto">
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isEditMode && !nonConformance) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              Non-conformance not found
              <Button onClick={handleBackToList} className="mt-4 block mx-auto">
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {isEditMode ? 'Edit Non-Conformance' : 'New Non-Conformance'}
        </h1>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBackToList}
          className="hover:border-accent hover:text-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
      
      <div className="bg-gradient-to-br from-white to-accent/5 border border-accent/20 rounded-lg shadow-lg p-6">
        {isEditMode && nonConformance ? (
          <NCEditForm 
            nonConformance={nonConformance}
            onSave={handleSave}
            onCancel={handleBackToList}
          />
        ) : (
          <NCCreateForm />
        )}
      </div>
    </motion.div>
  );
};

export default NonConformanceFormPage;
