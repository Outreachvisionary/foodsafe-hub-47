
import React, { useState, useEffect } from 'react';
import { 
  getDocumentsRelatedToNC, 
  getTrainingRelatedToNC, 
  getAuditsRelatedToNC,
  createNCRelationship,
  removeNCRelationship
} from '@/services/nonConformanceService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { File, BookOpen, Clipboard, Plus, X } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface NCIntegrationsListProps {
  nonConformanceId: string;
}

const NCIntegrationsList: React.FC<NCIntegrationsListProps> = ({ nonConformanceId }) => {
  const [relatedDocuments, setRelatedDocuments] = useState<any[]>([]);
  const [relatedTraining, setRelatedTraining] = useState<any[]>([]);
  const [relatedAudits, setRelatedAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false);
  const [linkType, setLinkType] = useState<string>('');
  const [linkId, setLinkId] = useState<string>('');
  const { toast } = useToast();

  const loadRelatedItems = async () => {
    try {
      setLoading(true);
      const [documents, training, audits] = await Promise.all([
        getDocumentsRelatedToNC(nonConformanceId),
        getTrainingRelatedToNC(nonConformanceId),
        getAuditsRelatedToNC(nonConformanceId)
      ]);
      
      setRelatedDocuments(documents);
      setRelatedTraining(training);
      setRelatedAudits(audits);
    } catch (error) {
      console.error('Error loading related items:', error);
      toast({
        title: 'Error loading related items',
        description: 'There was an error loading related items.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelatedItems();
  }, [nonConformanceId]);

  const handleAddLink = async () => {
    if (!linkId || !linkType) {
      toast({
        title: 'Missing information',
        description: 'Please enter an ID and select a type.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await createNCRelationship(
        nonConformanceId,
        linkId,
        linkType,
        'related_to',
        'current-user' // This should be the actual user ID in a real app
      );
      
      toast({
        title: 'Link added',
        description: `Successfully linked to ${linkType} item.`
      });
      
      // Reload related items
      loadRelatedItems();
      
      // Reset form
      setLinkId('');
      setLinkDialogOpen(false);
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: 'Error adding link',
        description: 'There was an error creating the link.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveLink = async (id: string, type: string) => {
    try {
      await removeNCRelationship(
        nonConformanceId,
        id,
        type,
        'current-user' // This should be the actual user ID in a real app
      );
      
      toast({
        title: 'Link removed',
        description: `Successfully removed link to ${type} item.`
      });
      
      // Reload related items
      loadRelatedItems();
    } catch (error) {
      console.error('Error removing link:', error);
      toast({
        title: 'Error removing link',
        description: 'There was an error removing the link.',
        variant: 'destructive'
      });
    }
  };

  const openLinkDialog = (type: string) => {
    setLinkType(type);
    setLinkDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
          </TabsList>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openLinkDialog(activeTab === 'documents' ? 'documents' : activeTab === 'training' ? 'training_sessions' : 'audits')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Link {activeTab === 'documents' ? 'Document' : activeTab === 'training' ? 'Training' : 'Audit'}
          </Button>
        </div>
        
        <TabsContent value="documents">
          {relatedDocuments.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No documents linked</h3>
              <p className="text-sm text-gray-500 mb-4">There are no documents linked to this non-conformance yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openLinkDialog('documents')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Link Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {relatedDocuments.map((item) => (
                <div key={item.target_id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <h4 className="font-medium">{item.document?.title || 'Document'}</h4>
                      <p className="text-sm text-gray-500">
                        {item.document?.category || 'Unknown'} • 
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/documents/${item.target_id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLink(item.target_id, 'documents')}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="training">
          {relatedTraining.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No training linked</h3>
              <p className="text-sm text-gray-500 mb-4">There are no training sessions linked to this non-conformance yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openLinkDialog('training_sessions')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Link Training
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {relatedTraining.map((item) => (
                <div key={item.target_id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <h4 className="font-medium">{item.training_session?.title || 'Training Session'}</h4>
                      <p className="text-sm text-gray-500">
                        {item.training_session?.training_type || 'Unknown'} • 
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/training/${item.target_id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLink(item.target_id, 'training_sessions')}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audits">
          {relatedAudits.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No audits linked</h3>
              <p className="text-sm text-gray-500 mb-4">There are no audits linked to this non-conformance yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openLinkDialog('audits')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Link Audit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {relatedAudits.map((item) => (
                <div key={item.target_id} className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <Clipboard className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <h4 className="font-medium">{item.audit?.title || 'Audit'}</h4>
                      <p className="text-sm text-gray-500">
                        {item.audit?.audit_type || 'Unknown'} • 
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/audits/${item.target_id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLink(item.target_id, 'audits')}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link {linkType === 'documents' ? 'Document' : linkType === 'training_sessions' ? 'Training' : 'Audit'}</DialogTitle>
            <DialogDescription>
              Enter the ID of the {linkType === 'documents' ? 'document' : linkType === 'training_sessions' ? 'training session' : 'audit'} you want to link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Enter ID"
              value={linkId}
              onChange={(e) => setLinkId(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink}>
              Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NCIntegrationsList;
