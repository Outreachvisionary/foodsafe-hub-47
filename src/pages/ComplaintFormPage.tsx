import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createComplaint, updateComplaint, fetchComplaintById } from '@/services/complaintService';
import { Complaint, CreateComplaintRequest } from '@/types/complaint';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { useAuth } from '@/components/auth/SimpleAuthProvider';

const ComplaintFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      loadComplaint(id);
    }
  }, [id, isEditMode]);

  const loadComplaint = async (complaintId: string) => {
    try {
      setLoading(true);
      const complaintData = await fetchComplaintById(complaintId);
      setComplaint(complaintData);
    } catch (err) {
      setError('Failed to load complaint');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateComplaintRequest | Partial<Complaint>) => {
    if (!user) {
      toast.error('You must be logged in to create or edit complaints');
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEditMode && complaint) {
        await updateComplaint(complaint.id, data as Partial<Complaint>);
        toast.success('Complaint updated successfully');
        navigate(`/complaints/${complaint.id}`);
      } else {
        const complaintData = {
          ...data,
          created_by: user.email || user.id
        } as CreateComplaintRequest;
        
        const newComplaint = await createComplaint(complaintData);
        toast.success('Complaint created successfully');
        navigate(`/complaints/${newComplaint.id}`);
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} complaint`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && loading) {
    return (
      <>
        <DashboardHeader 
          title="Edit Complaint" 
          subtitle="Update complaint information" 
        />
        <LoadingState isLoading={true}>
          <div></div>
        </LoadingState>
      </>
    );
  }

  if (isEditMode && error) {
    return (
      <>
        <DashboardHeader 
          title="Edit Complaint" 
          subtitle="Error loading complaint" 
        />
        <div className="container max-w-4xl mx-auto py-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/complaints')}>
              Back to Complaints
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader 
        title={isEditMode ? 'Edit Complaint' : 'Log New Complaint'} 
        subtitle={isEditMode ? 'Update complaint information' : 'Record a new customer complaint'} 
      />
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/complaints')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complaints
          </Button>
        </div>

        <ComplaintForm
          complaint={complaint || undefined}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          mode={isEditMode ? 'edit' : 'create'}
        />
      </div>
    </>
  );
};

export default ComplaintFormPage;