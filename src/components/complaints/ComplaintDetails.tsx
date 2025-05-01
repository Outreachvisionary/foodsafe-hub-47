
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, MessageSquare, CheckCircle } from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { fetchComplaintById, updateComplaintStatus } from '@/services/complaintService';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { isComplaintStatusEqual } from '@/utils/complaintUtils';

interface ComplaintDetailsProps {}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const { toast } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadComplaint = async () => {
      if (!complaintId) {
        toast({
          title: "Error",
          description: "Complaint ID is missing",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const complaintData = await fetchComplaintById(complaintId);
        setComplaint(complaintData);
      } catch (error) {
        console.error("Error loading complaint:", error);
        toast({
          title: "Error",
          description: "Failed to load complaint details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [complaintId, toast]);

  const handleStatusUpdate = async (newStatus: ComplaintStatus) => {
    if (!complaintId || !complaint) {
      toast({
        title: "Error",
        description: "Complaint ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingStatus(true);
      if (!currentUser?.id) throw new Error("User ID is missing");
      
      const updatedComplaint = await updateComplaintStatus(complaintId, newStatus, currentUser.id);
      setComplaint(updatedComplaint);

      toast({
        title: "Complaint Status Updated",
        description: `Complaint status updated to ${newStatus.replace(/_/g, " ")}`,
      });
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleGoBack = () => {
    navigate('/complaints');
  };

  if (loading || !complaint) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading complaint details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{complaint.title}</h1>
          <p className="text-gray-500">
            <MessageSquare className="inline-block h-4 w-4 mr-1 align-middle" />
            Created on {new Date(complaint.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <Button variant="outline" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Category</p>
              <Badge variant="secondary">{complaint.category.replace(/_/g, " ")}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant="secondary">{complaint.status.replace(/_/g, " ")}</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-gray-500">{complaint.description}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Reported Date</p>
              <p className="text-gray-500">{new Date(complaint.reported_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Priority</p>
              <p className="text-gray-500">{complaint.priority}</p>
            </div>
          </div>
          {complaint.resolved_date && (
            <div>
              <p className="text-sm font-medium">Resolution Date</p>
              <p className="text-gray-500">{new Date(complaint.resolved_date).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(ComplaintStatus.New)}
              disabled={updatingStatus || complaint.status === ComplaintStatus.New}
            >
              {complaint.status === ComplaintStatus.New ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  New
                </>
              ) : (
                'Mark as New'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(ComplaintStatus.Under_Investigation)}
              disabled={updatingStatus || complaint.status === ComplaintStatus.Under_Investigation}
            >
              {complaint.status === ComplaintStatus.Under_Investigation ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Under Investigation
                </>
              ) : (
                'Mark as Under Investigation'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(ComplaintStatus.Resolved)}
              disabled={updatingStatus || complaint.status === ComplaintStatus.Resolved}
            >
              {complaint.status === ComplaintStatus.Resolved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolved
                </>
              ) : (
                'Mark as Resolved'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate(ComplaintStatus.Closed)}
              disabled={updatingStatus || complaint.status === ComplaintStatus.Closed}
            >
              {complaint.status === ComplaintStatus.Closed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Closed
                </>
              ) : (
                'Mark as Closed'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
