import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentLinkPageProps {}

const DocumentLinkPage: React.FC<DocumentLinkPageProps> = () => {
  const { sourceType, sourceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    // Here you would fetch documents that could be linked
    const fetchAvailableDocuments = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        // const response = await fetchDocuments();
        // setDocuments(response);
        
        // Mock data for now
        setDocuments([
          { id: 'doc1', title: 'Document 1', type: 'PDF', created_at: new Date().toISOString() },
          { id: 'doc2', title: 'Document 2', type: 'Word', created_at: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableDocuments();
  }, [toast]);
  
  const handleLinkDocument = async (documentId: string) => {
    try {
      // Replace with your actual API call to link document
      // await linkDocumentToSource(sourceType, sourceId, documentId);
      
      toast({
        title: 'Success',
        description: 'Document linked successfully',
      });
      
      // Navigate back to the source
      navigate(`/${sourceType}/${sourceId}`);
    } catch (error) {
      console.error('Error linking document:', error);
      toast({
        title: 'Error',
        description: 'Failed to link document',
        variant: 'destructive',
      });
    }
  };
  
  const getSourceName = () => {
    switch (sourceType) {
      case 'nonconformance': 
        return 'Non-Conformance';
      case 'capa':
        return 'CAPA';
      default:
        return sourceType;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Link Document to {getSourceName()}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select a Document to Link</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents available to link</p>
              <Button 
                onClick={() => navigate('/documents/new')} 
                className="mt-4"
              >
                Create New Document
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-gray-500">
                      {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLinkDocument(doc.id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentLinkPage;
