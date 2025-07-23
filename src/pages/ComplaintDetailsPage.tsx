import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { ArrowLeft, Edit, Calendar, User, AlertCircle, MessageSquare, Phone, Package, Hash, Zap } from 'lucide-react';
import { fetchComplaintById, createCAPAFromComplaint } from '@/services/complaintService';
import { Complaint } from '@/types/complaint';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/components/auth/SimpleAuthProvider';

const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCAPA, setGeneratingCAPA] = useState(false);
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (id) {
      loadComplaintDetails(id);
    }
  }, [id]);

  const loadComplaintDetails = async (complaintId: string) => {
    try {
      setLoading(true);
      const complaintData = await fetchComplaintById(complaintId);
      setComplaint(complaintData);
    } catch (err) {
      setError('Failed to load complaint details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCAPA = async () => {
    if (!complaint || !user) return;

    try {
      setGeneratingCAPA(true);
      const capa = await createCAPAFromComplaint(complaint.id, user.id);
      toast.success('CAPA generated successfully from complaint');
      
      // Reload complaint details to show the linked CAPA
      await loadComplaintDetails(complaint.id);
    } catch (error) {
      console.error('Error generating CAPA:', error);
      toast.error('Failed to generate CAPA');
    } finally {
      setGeneratingCAPA(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Under_Investigation':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Escalated':
        return 'bg-red-100 text-red-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Product_Quality':
        return 'bg-orange-100 text-orange-800';
      case 'Food_Safety':
        return 'bg-red-100 text-red-800';
      case 'Foreign_Material':
        return 'bg-orange-100 text-orange-800';
      case 'Service':
        return 'bg-purple-100 text-purple-800';
      case 'Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Packaging':
        return 'bg-green-100 text-green-800';
      case 'Labeling':
        return 'bg-yellow-100 text-yellow-800';
      case 'Other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <LoadingState isLoading={true}>
          <div className="text-center py-8">Loading complaint details...</div>
        </LoadingState>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">{error || 'Complaint not found'}</p>
            <Button onClick={() => navigate('/complaints')}>
              Back to Complaints
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/complaints')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complaints
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/complaints/edit/${complaint.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Complaint
            </Button>
            {!complaint.capa_id && (
              <Button onClick={handleGenerateCAPA} disabled={generatingCAPA}>
                <Zap className="h-4 w-4 mr-2" />
                {generatingCAPA ? 'Generating...' : 'Generate CAPA'}
              </Button>
            )}
          </div>
        </div>

        {/* Complaint Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className={getCategoryColor(complaint.category)}>
                    {complaint.category.replace(/_/g, ' ')}
                  </Badge>
                  {complaint.capa_id && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      <Zap className="h-3 w-3 mr-1" />
                      CAPA Linked
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reported Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(complaint.reported_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              {complaint.customer_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{complaint.customer_name}</span>
                  </div>
                </div>
              )}
              
              {complaint.assigned_to && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{complaint.assigned_to}</span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span>{complaint.created_by}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="capa">CAPA Integration</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{complaint.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complaint.customer_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                      <p className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {complaint.customer_name}
                      </p>
                    </div>
                  )}
                  {complaint.customer_contact && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {complaint.customer_contact}
                      </p>
                    </div>
                  )}
                  {!complaint.customer_name && !complaint.customer_contact && (
                    <p className="text-muted-foreground italic">No customer information available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complaint.product_involved && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product Involved</p>
                      <p className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {complaint.product_involved}
                      </p>
                    </div>
                  )}
                  {complaint.lot_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lot/Batch Number</p>
                      <p className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        {complaint.lot_number}
                      </p>
                    </div>
                  )}
                  {!complaint.product_involved && !complaint.lot_number && (
                    <p className="text-muted-foreground italic">No product information available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capa">
            <Card>
              <CardHeader>
                <CardTitle>CAPA Integration</CardTitle>
              </CardHeader>
              <CardContent>
                {complaint.capa_id ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-800">CAPA Generated</h4>
                      </div>
                      <p className="text-green-700 mb-3">
                        A CAPA has been automatically generated to address this complaint.
                      </p>
                      <div className="text-sm text-green-600">
                        <strong>CAPA ID:</strong> {complaint.capa_id}
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/capa/${complaint.capa_id}`)}
                      className="w-full"
                    >
                      View CAPA Details
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800">No CAPA Generated</h4>
                      </div>
                      <p className="text-yellow-700">
                        No CAPA is currently linked to this complaint. You can generate a CAPA to address the issues identified in this complaint.
                      </p>
                    </div>
                    <Button 
                      onClick={handleGenerateCAPA} 
                      disabled={generatingCAPA}
                      className="w-full"
                    >
                      {generatingCAPA ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                          Generating CAPA...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate CAPA
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Complaint History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">Complaint Created</p>
                      <p className="text-sm text-muted-foreground">
                        Created by {complaint.created_by} on {format(new Date(complaint.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  {complaint.capa_id && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">CAPA Generated</p>
                        <p className="text-sm text-muted-foreground">
                          CAPA automatically generated from this complaint
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {complaint.resolution_date && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">Complaint Resolved</p>
                        <p className="text-sm text-muted-foreground">
                          Resolved on {format(new Date(complaint.resolution_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default ComplaintDetailsPage;