
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  getDocumentsRelatedToNC, 
  getTrainingRelatedToNC, 
  getAuditsRelatedToNC 
} from '@/services/nonConformanceService';
import { FileText, FileCheck, Calendar, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NCIntegrationsListProps {
  nonConformanceId: string;
}

const NCIntegrationsList: React.FC<NCIntegrationsListProps> = ({ nonConformanceId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadIntegrations = async () => {
      if (!nonConformanceId) {
        setError("No non-conformance ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('Loading integrations for NC ID:', nonConformanceId);
        
        // Load related documents
        const docsData = await getDocumentsRelatedToNC(nonConformanceId);
        setDocuments(Array.isArray(docsData) ? docsData : []);
        
        // Load related training
        const trainingData = await getTrainingRelatedToNC(nonConformanceId);
        setTrainings(Array.isArray(trainingData) ? trainingData : []);
        
        // Load related audits
        const auditData = await getAuditsRelatedToNC(nonConformanceId);
        setAudits(Array.isArray(auditData) ? auditData : []);
      } catch (error) {
        console.error('Error loading integrations:', error);
        setError("Failed to load integrated data");
        toast({
          title: 'Failed to load integrations',
          description: 'There was an error loading integrated data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadIntegrations();
  }, [nonConformanceId, toast]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrated Modules</CardTitle>
          <CardDescription>
            View related documents, training sessions, and audits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-md">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-gray-700 font-medium">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrated Modules</CardTitle>
          <CardDescription>
            Loading related content...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasIntegrations = documents.length > 0 || trainings.length > 0 || audits.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrated Modules</CardTitle>
        <CardDescription>
          View related documents, training sessions, and audits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasIntegrations ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-gray-500">No integrations found</p>
            <p className="text-xs text-gray-400 mt-1">
              This non-conformance is not currently linked to other modules.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="documents">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents" disabled={documents.length === 0}>
                Documents ({documents.length})
              </TabsTrigger>
              <TabsTrigger value="training" disabled={trainings.length === 0}>
                Training ({trainings.length})
              </TabsTrigger>
              <TabsTrigger value="audits" disabled={audits.length === 0}>
                Audits ({audits.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="mt-4">
              {documents.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-gray-500">No related documents</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium text-sm">
                            {doc.documents?.title || 'Untitled Document'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.documents?.category || 'No category'} · 
                            {doc.documents?.created_at && new Date(doc.documents.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/documents/${doc.target_id}`)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="training" className="mt-4">
              {trainings.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-gray-500">No related training sessions</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trainings.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileCheck className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium text-sm">
                            {training.training_sessions?.title || 'Untitled Training'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {training.training_sessions?.training_type || 'No type'} · 
                            {training.training_sessions?.due_date && 
                              `Due: ${new Date(training.training_sessions.due_date).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/training/${training.target_id}`)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="audits" className="mt-4">
              {audits.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-gray-500">No related audits</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {audits.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium text-sm">
                            {audit.audits?.title || 'Untitled Audit'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {audit.audits?.audit_type || 'No type'} · 
                            {audit.audits?.status || 'Unknown status'} · 
                            {audit.audits?.due_date && 
                              `Due: ${new Date(audit.audits.due_date).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/audits/${audit.target_id}`)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default NCIntegrationsList;
