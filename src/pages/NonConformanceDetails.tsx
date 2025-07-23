import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Save, X, AlertTriangle, FileText, Activity, Link, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNonConformance } from '@/hooks/useNonConformances';
import { useNCCAPAIntegration } from '@/hooks/useNCCAPAIntegration';
import { toast } from 'sonner';
import NCEditForm from '@/components/non-conformance/NCEditForm';
import NCStatusTimeline from '@/components/non-conformance/NCStatusTimeline';
import NCAttachmentManager from '@/components/non-conformance/NCAttachmentManager';
import NCCAPAIntegration from '@/components/non-conformance/NCCAPAIntegration';
import NCAnalytics from '@/components/non-conformance/NCAnalytics';
import NCRelatedItems from '@/components/non-conformance/NCRelatedItems';

const NonConformanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: nonConformance, isLoading, error } = useNonConformance(id || '');
  const ncCapaIntegration = useNCCAPAIntegration(id || '');

  const handleBack = () => {
    navigate('/non-conformance');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast.success('Non-conformance updated successfully');
  };

  const handleGenerateCAPA = async (isAutomatic: boolean = false) => {
    try {
      ncCapaIntegration.generateCAPA({ isAutomatic });
      setActiveTab('capa');
    } catch (error) {
      console.error('Error generating CAPA:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nonConformance) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-destructive mb-4">
                {String(error) || 'Non-conformance not found'}
              </p>
              <Button onClick={handleBack}>
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Hold': return 'bg-destructive text-destructive-foreground';
      case 'Under Investigation': return 'bg-warning text-warning-foreground';
      case 'Under Review': return 'bg-secondary text-secondary-foreground';
      case 'Resolved': return 'bg-success text-success-foreground';
      case 'Closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              NC-{nonConformance.id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">{nonConformance.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={handleEdit} size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSaveEdit} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusColor(nonConformance.status)}>
                {nonConformance.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <Badge className={getRiskColor(nonConformance.risk_level || '')}>
                {nonConformance.risk_level || 'Not Assessed'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">CAPA Status</p>
              {nonConformance.capa_id ? (
                <Badge variant="default" className="bg-primary/10 text-primary">
                  CAPA Linked
                </Badge>
              ) : (
                <div className="flex space-x-2">
                  <Badge variant="outline">No CAPA</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateCAPA(true)}
                    disabled={ncCapaIntegration.isGeneratingCAPA}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Auto Generate
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              <p className="text-sm font-medium">
                {nonConformance.assigned_to || 'Unassigned'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="attachments" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Files</span>
          </TabsTrigger>
          <TabsTrigger value="capa" className="flex items-center space-x-2">
            <Link className="h-4 w-4" />
            <span>CAPA</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="related" className="flex items-center space-x-2">
            <Link className="h-4 w-4" />
            <span>Related</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isEditing ? (
            <NCEditForm
              nonConformance={nonConformance}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                    <p className="mt-1">{nonConformance.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="mt-1">{nonConformance.description || 'No description provided'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Item Name</p>
                      <p className="mt-1">{nonConformance.item_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="mt-1">{nonConformance.item_category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Department</p>
                      <p className="mt-1">{nonConformance.department || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="mt-1">{nonConformance.location || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reason Category</p>
                    <p className="mt-1">{nonConformance.reason_category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reason Details</p>
                    <p className="mt-1">{nonConformance.reason_details || 'No details provided'}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                      <p className="mt-1">{nonConformance.quantity || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quantity on Hold</p>
                      <p className="mt-1">{nonConformance.quantity_on_hold || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reported Date</p>
                    <p className="mt-1">
                      {nonConformance.reported_date 
                        ? new Date(nonConformance.reported_date).toLocaleString()
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <NCStatusTimeline nonConformanceId={id || ''} />
        </TabsContent>

        <TabsContent value="attachments">
          <NCAttachmentManager nonConformanceId={id || ''} />
        </TabsContent>

        <TabsContent value="capa">
          <NCCAPAIntegration 
            nonConformance={nonConformance}
            onCAPAGenerated={() => setActiveTab('capa')}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <NCAnalytics nonConformance={nonConformance} />
        </TabsContent>

        <TabsContent value="related">
          <NCRelatedItems nonConformanceId={id || ''} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default NonConformanceDetails;