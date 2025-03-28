
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CAPA } from '@/types/capa';
import { fetchCAPAById } from '@/services/capaService';
import CAPADetails from '@/components/capa/CAPADetails';
import DashboardHeader from '@/components/DashboardHeader';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

const CAPADetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [capa, setCapa] = useState<CAPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadCAPA = async () => {
      try {
        if (!id) {
          setError('No CAPA ID provided');
          setLoading(false);
          return;
        }

        const capaData = await fetchCAPAById(id);
        setCapa(capaData);
      } catch (err) {
        console.error('Error loading CAPA:', err);
        setError('Failed to load CAPA details');
        toast({
          title: 'Error',
          description: 'Failed to load CAPA details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCAPA();
  }, [id, toast]);

  const handleClose = () => {
    navigate('/capa');
  };

  const handleUpdate = (updatedCAPA: CAPA) => {
    setCapa(updatedCAPA);
    toast({
      title: 'CAPA Updated',
      description: 'CAPA details have been updated successfully',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="CAPA Details" 
        subtitle="View and manage corrective and preventive action details"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CAPA List
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 flex justify-center items-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading CAPA details...</span>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center text-red-500">
            {error}
          </Card>
        ) : capa ? (
          <CAPADetails
            capa={capa}
            onClose={handleClose}
            onUpdate={handleUpdate}
          />
        ) : (
          <Card className="p-8 text-center">
            CAPA not found
          </Card>
        )}
      </main>
    </div>
  );
};

export default CAPADetailsPage;
