import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { ArrowLeft, Edit, Calendar, User, AlertCircle, MessageSquare, Phone, Package, Hash, Zap, Clock, FileText, Activity, ExternalLink, Shield, Tag, MapPin } from 'lucide-react';
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
            <div className="space-y-6">
              {/* Complaint Overview Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Complaint Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Category
                      </p>
                      <Badge variant="outline" className={getCategoryColor(complaint.category)}>
                        {complaint.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Status
                      </p>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    {complaint.priority && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Priority
                        </p>
                        <Badge variant="secondary">
                          {complaint.priority}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customer & Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complaint.customer_name && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Customer Name</p>
                        <p className="flex items-center gap-2 font-medium">
                          <User className="h-4 w-4 text-primary" />
                          {complaint.customer_name}
                        </p>
                      </div>
                    )}
                    {complaint.customer_contact && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Contact Information</p>
                        <p className="flex items-center gap-2 font-medium">
                          <Phone className="h-4 w-4 text-primary" />
                          {complaint.customer_contact}
                        </p>
                      </div>
                    )}
                    {!complaint.customer_name && !complaint.customer_contact && (
                      <div className="text-center py-8 text-muted-foreground">
                        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="italic">No customer information available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complaint.product_involved && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Product Involved</p>
                        <p className="flex items-center gap-2 font-medium">
                          <Package className="h-4 w-4 text-primary" />
                          {complaint.product_involved}
                        </p>
                      </div>
                    )}
                    {complaint.lot_number && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Lot/Batch Number</p>
                        <p className="flex items-center gap-2 font-medium">
                          <Hash className="h-4 w-4 text-primary" />
                          {complaint.lot_number}
                        </p>
                      </div>
                    )}
                    {!complaint.product_involved && !complaint.lot_number && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="italic">No product information available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Reported Date</p>
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(complaint.reported_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Created Date</p>
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    {complaint.resolution_date && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Resolution Date</p>
                        <p className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(complaint.resolution_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Last Updated</p>
                      <p className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {format(new Date(complaint.updated_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Assignment & Responsibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Created By</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{complaint.created_by}</span>
                      </div>
                    </div>
                    
                    {complaint.assigned_to ? (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Assigned To</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{complaint.assigned_to}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-lg border border-dashed">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Assignment Status</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <span className="italic">Not yet assigned</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capa">
            <div className="space-y-6">
              {/* CAPA Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    CAPA Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {complaint.capa_id ? (
                    <div className="space-y-6">
                      {/* Success State */}
                      <div className="relative p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="absolute top-4 right-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                              CAPA Successfully Generated
                            </h4>
                            <p className="text-green-700 dark:text-green-300 mb-4">
                              A Corrective and Preventive Action plan has been automatically generated to address the issues identified in this complaint.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-white dark:bg-green-950/30 rounded border">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">CAPA ID</p>
                                <p className="font-mono text-sm">{complaint.capa_id}</p>
                              </div>
                              <div className="p-3 bg-white dark:bg-green-950/30 rounded border">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Integration Status</p>
                                <p className="text-sm flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Active & Linked
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CAPA Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={() => navigate(`/capa/${complaint.capa_id}`)}
                          className="h-12"
                          size="lg"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View CAPA Details
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/capa/${complaint.capa_id}?tab=actions`)}
                          className="h-12"
                          size="lg"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          View Action Plan
                        </Button>
                      </div>

                      {/* CAPA Information Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">CAPA Quick Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Generated From</span>
                              <span className="text-muted-foreground">Complaint #{complaint.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Category</span>
                              <Badge variant="outline">{complaint.category.replace(/_/g, ' ')}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Priority Level</span>
                              <Badge variant="secondary">Auto-assigned based on complaint severity</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Warning State */}
                      <div className="relative p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="absolute top-4 right-4">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                              No CAPA Generated Yet
                            </h4>
                            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                              This complaint does not have a linked CAPA. Consider generating a CAPA to ensure proper corrective and preventive actions are taken.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Generation Options */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Generate CAPA</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground text-sm">
                            Generate a CAPA to address the root cause and prevent recurrence of similar complaints.
                          </p>
                          
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What will be included:</h5>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                              <li>• Root cause analysis framework</li>
                              <li>• Corrective action plan</li>
                              <li>• Preventive measures</li>
                              <li>• Implementation timeline</li>
                              <li>• Effectiveness verification</li>
                            </ul>
                          </div>

                          <Button 
                            onClick={handleGenerateCAPA} 
                            disabled={generatingCAPA}
                            className="w-full h-12"
                            size="lg"
                          >
                            {generatingCAPA ? (
                              <>
                                <div className="animate-spin h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                Generating CAPA...
                              </>
                            ) : (
                              <>
                                <Zap className="h-5 w-5 mr-2" />
                                Generate CAPA from Complaint
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Complaint Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-green-200 to-gray-200 dark:from-blue-800 dark:via-green-800 dark:to-gray-800"></div>
                    
                    <div className="space-y-8">
                      {/* Complaint Created */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Complaint Created</h4>
                              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                                Initial Report
                              </span>
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                              Complaint logged into the system by {complaint.created_by}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-blue-600 dark:text-blue-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(complaint.created_at), 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Changes */}
                      {complaint.status !== 'New' && (
                        <div className="relative flex items-start gap-6">
                          <div className="relative z-10 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                            <Activity className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Status Updated</h4>
                                <Badge className={getStatusColor(complaint.status)}>
                                  {complaint.status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                                Complaint status changed to {complaint.status.replace(/_/g, ' ')}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-yellow-600 dark:text-yellow-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(complaint.updated_at), 'MMM d, yyyy h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assignment */}
                      {complaint.assigned_to && (
                        <div className="relative flex items-start gap-6">
                          <div className="relative z-10 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Complaint Assigned</h4>
                                <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded">
                                  Assignment
                                </span>
                              </div>
                              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                                Complaint assigned to {complaint.assigned_to} for investigation
                              </p>
                              <div className="flex items-center gap-4 text-xs text-purple-600 dark:text-purple-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {complaint.assigned_to}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CAPA Generation */}
                      {complaint.capa_id && (
                        <div className="relative flex items-start gap-6">
                          <div className="relative z-10 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-green-800 dark:text-green-200">CAPA Generated</h4>
                                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
                                  Auto-Generated
                                </span>
                              </div>
                              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                                Corrective and Preventive Action plan automatically generated from this complaint
                              </p>
                              <div className="flex items-center gap-4 text-xs text-green-600 dark:text-green-400">
                                <span className="flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  CAPA ID: {complaint.capa_id}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 px-2 text-xs"
                                  onClick={() => navigate(`/capa/${complaint.capa_id}`)}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Resolution */}
                      {complaint.resolution_date && (
                        <div className="relative flex items-start gap-6">
                          <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Complaint Resolved</h4>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded">
                                  Resolution
                                </span>
                              </div>
                              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                                Complaint successfully resolved and closed
                              </p>
                              <div className="flex items-center gap-4 text-xs text-emerald-600 dark:text-emerald-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(complaint.resolution_date), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(complaint.resolution_date), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Current Status */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="p-4 bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Current Status</h4>
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                              Last updated on {format(new Date(complaint.updated_at), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Timeline Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.ceil((new Date().getTime() - new Date(complaint.created_at).getTime()) / (1000 * 3600 * 24))}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Days Active</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {complaint.capa_id ? '1' : '0'}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">CAPA Generated</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {complaint.resolution_date ? '✓' : '⏳'}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {complaint.resolution_date ? 'Resolved' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default ComplaintDetailsPage;