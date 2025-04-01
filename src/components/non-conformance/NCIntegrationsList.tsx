
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ClipboardCheck, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { fetchRelatedTraining } from '@/services/supabaseService';

interface NCIntegrationsListProps {
  nonConformanceId: string;
}

type IntegrationType = 'capa' | 'document' | 'training';

const NCIntegrationsList: React.FC<NCIntegrationsListProps> = ({ nonConformanceId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [capaItems, setCapaItems] = useState<any[]>([]);
  const [trainingItems, setTrainingItems] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        
        // Fetch CAPA relationships
        const { data: capaData, error: capaError } = await supabase
          .from('capa_actions')
          .select('*')
          .eq('source_id', nonConformanceId)
          .eq('source', 'non_conformance');
          
        if (capaError) throw capaError;
        setCapaItems(capaData || []);
        
        // Fetch document relationships
        const { data: docData, error: docError } = await supabase
          .from('module_relationships')
          .select(`
            *,
            documents:target_id (*)
          `)
          .eq('source_id', nonConformanceId)
          .eq('source_type', 'non_conformance')
          .eq('target_type', 'document');
          
        if (docError) throw docError;
        setDocuments(docData?.map(item => item.documents) || []);
        
        // Fetch training relationships using the new service method
        const trainingData = await fetchRelatedTraining(nonConformanceId);
        setTrainingItems(trainingData || []);
        
      } catch (err) {
        console.error('Error fetching integrations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [nonConformanceId]);
  
  const renderStatusBadge = (status: string) => {
    let color = 'bg-gray-100 text-gray-800';
    
    if (status?.toLowerCase().includes('complete') || status?.toLowerCase().includes('closed')) {
      color = 'bg-green-100 text-green-800';
    } else if (status?.toLowerCase().includes('progress') || status?.toLowerCase().includes('review')) {
      color = 'bg-blue-100 text-blue-800';
    } else if (status?.toLowerCase().includes('open') || status?.toLowerCase().includes('assigned')) {
      color = 'bg-yellow-100 text-yellow-800';
    } else if (status?.toLowerCase().includes('overdue')) {
      color = 'bg-red-100 text-red-800';
    }
    
    return (
      <Badge className={color}>
        {status}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Format training items for display
  const formattedTrainingItems = trainingItems.map(item => {
    const sessionData = item.training_records?.training_sessions || {};
    const recordData = item.training_records || {};
    
    return {
      id: item.target_id,
      title: sessionData.title || 'Training Assignment',
      status: recordData.status || 'Not Started',
      dueDate: recordData.due_date,
      assignedTo: recordData.employee_name,
      type: 'training' as IntegrationType
    };
  });
  
  const allIntegrations = [
    ...capaItems.map(item => ({
      id: item.id,
      title: item.title,
      status: item.status,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      type: 'capa' as IntegrationType
    })),
    ...formattedTrainingItems,
    ...documents.filter(Boolean).map(doc => ({
      id: doc.id,
      title: doc.title,
      status: doc.status,
      dueDate: doc.expiry_date,
      type: 'document' as IntegrationType
    }))
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({allIntegrations.length})</TabsTrigger>
            <TabsTrigger value="capa">CAPA ({capaItems.length})</TabsTrigger>
            <TabsTrigger value="training">Training ({formattedTrainingItems.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {allIntegrations.length > 0 ? (
              <div className="space-y-3">
                {allIntegrations.map(item => (
                  <IntegrationItem 
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onClick={() => {
                      if (item.type === 'capa') {
                        navigate(`/capa/${item.id}`);
                      } else if (item.type === 'document') {
                        // Navigate to document
                      } else if (item.type === 'training') {
                        navigate(`/training`);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No related items found" />
            )}
          </TabsContent>
          
          <TabsContent value="capa">
            {capaItems.length > 0 ? (
              <div className="space-y-3">
                {capaItems.map(item => (
                  <IntegrationItem 
                    key={`capa-${item.id}`}
                    item={{
                      id: item.id,
                      title: item.title,
                      status: item.status,
                      dueDate: item.due_date,
                      assignedTo: item.assigned_to,
                      type: 'capa' as IntegrationType
                    }}
                    onClick={() => navigate(`/capa/${item.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No CAPA actions found" />
            )}
          </TabsContent>
          
          <TabsContent value="training">
            {formattedTrainingItems.length > 0 ? (
              <div className="space-y-3">
                {formattedTrainingItems.map(item => (
                  <IntegrationItem 
                    key={`training-${item.id}`}
                    item={item}
                    onClick={() => navigate(`/training`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No training assignments found" />
            )}
          </TabsContent>
          
          <TabsContent value="documents">
            {documents.filter(Boolean).length > 0 ? (
              <div className="space-y-3">
                {documents.filter(Boolean).map(doc => (
                  <IntegrationItem 
                    key={`doc-${doc.id}`}
                    item={{
                      id: doc.id,
                      title: doc.title,
                      status: doc.status,
                      dueDate: doc.expiry_date,
                      type: 'document' as IntegrationType
                    }}
                    onClick={() => {/* Navigate to document */}}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No related documents found" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface IntegrationItemProps {
  item: {
    id: string;
    title: string;
    status?: string;
    dueDate?: string;
    assignedTo?: string;
    type: IntegrationType;
  };
  onClick: () => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'capa':
        return <ClipboardCheck className="h-5 w-5 text-blue-600" />;
      case 'document':
        return <FileSpreadsheet className="h-5 w-5 text-purple-600" />;
      case 'training':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div 
      className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div>
            <h4 className="text-sm font-medium">{item.title}</h4>
            {item.assignedTo && (
              <p className="text-xs text-muted-foreground">Assigned to: {item.assignedTo}</p>
            )}
            {item.dueDate && (
              <p className="text-xs text-muted-foreground">
                Due: {new Date(item.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        {item.status && (
          <div>
            <Badge 
              variant="outline" 
              className={
                (item.status?.toLowerCase().includes('complete') || item.status?.toLowerCase().includes('closed')) ? 'border-green-500 text-green-600' : 
                (item.status?.toLowerCase().includes('progress') || item.status?.toLowerCase().includes('review')) ? 'border-blue-500 text-blue-600' :
                (item.status?.toLowerCase().includes('open') || item.status?.toLowerCase().includes('assigned')) ? 'border-yellow-500 text-yellow-600' :
                'border-gray-500 text-gray-600'
              }
            >
              {item.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-6 border border-dashed rounded-md">
    <p className="text-muted-foreground">{message}</p>
    
    <Button variant="outline" className="mt-4">
      Create New
    </Button>
  </div>
);

export default NCIntegrationsList;
