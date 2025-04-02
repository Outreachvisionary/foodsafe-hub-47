import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document, DocumentRelationship } from '@/types/document';
import { useDocuments } from '@/contexts/DocumentContext';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentRelationshipManagerProps {
  document: Document;
  onUpdate?: () => void;
}

export const DocumentRelationshipManager: React.FC<DocumentRelationshipManagerProps> = ({ 
  document,
  onUpdate 
}) => {
  const { documents, updateDocument } = useDocuments();
  const { toast } = useToast();
  const [relationships, setRelationships] = useState<DocumentRelationship[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('references');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Filter out the current document from available documents
  const availableDocuments = documents.filter(doc => doc.id !== document.id);

  useEffect(() => {
    // In a real implementation, this would fetch relationships from the backend
    // For now, we'll just use any related documents stored in the document metadata
    const relatedDocs = document.related_documents || [];
    
    const mappedRelationships: DocumentRelationship[] = relatedDocs.map((relatedDocId, index) => {
      const relatedDoc = documents.find(d => d.id === relatedDocId);
      return {
        id: `rel-${index}`,
        sourceDocumentId: document.id,
        targetDocumentId: relatedDocId,
        relationshipType: 'references',
        createdBy: document.created_by,
        createdAt: new Date().toISOString(),
        notes: `Relationship with ${relatedDoc?.title || 'Unknown Document'}`
      };
    });
    
    setRelationships(mappedRelationships);
  }, [document, documents]);

  const handleAddRelationship = async () => {
    if (!selectedDocumentId) {
      toast({
        title: "Selection Required",
        description: "Please select a document to create a relationship",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create new relationship
      const newRelationship: DocumentRelationship = {
        id: `rel-${Date.now()}`,
        sourceDocumentId: document.id,
        targetDocumentId: selectedDocumentId,
        relationshipType: relationshipType as any,
        createdBy: document.created_by,
        createdAt: new Date().toISOString(),
        notes: notes
      };
      
      // Update local state
      setRelationships([...relationships, newRelationship]);
      
      // Update document with new related document ID
      const relatedDocs = [...(document.related_documents || []), selectedDocumentId];
      await updateDocument({
        ...document,
        related_documents: relatedDocs
      });
      
      // Reset form
      setSelectedDocumentId('');
      setRelationshipType('references');
      setNotes('');
      
      toast({
        title: "Relationship Created",
        description: "Document relationship has been established",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding relationship:', error);
      toast({
        title: "Failed to Create Relationship",
        description: "An error occurred while creating the relationship",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRelationship = async (relationshipId: string, targetDocId: string) => {
    setLoading(true);
    
    try {
      // Remove from local state
      const updatedRelationships = relationships.filter(rel => rel.id !== relationshipId);
      setRelationships(updatedRelationships);
      
      // Update document to remove the related document ID
      const relatedDocs = (document.related_documents || []).filter(id => id !== targetDocId);
      await updateDocument({
        ...document,
        related_documents: relatedDocs
      });
      
      toast({
        title: "Relationship Removed",
        description: "Document relationship has been removed",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error removing relationship:', error);
      toast({
        title: "Failed to Remove Relationship",
        description: "An error occurred while removing the relationship",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-primary" />
          Document Relationships
        </CardTitle>
        <CardDescription>
          Manage relationships between this document and other documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new relationship form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
            <div>
              <Label htmlFor="document">Related Document</Label>
              <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                <SelectTrigger id="document">
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Relationship Type</Label>
              <Select value={relationshipType} onValueChange={setRelationshipType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="references">References</SelectItem>
                  <SelectItem value="supersedes">Supersedes</SelectItem>
                  <SelectItem value="requires">Requires</SelectItem>
                  <SelectItem value="supports">Supports</SelectItem>
                  <SelectItem value="implements">Implements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full" 
                onClick={handleAddRelationship} 
                disabled={loading || !selectedDocumentId}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Relationship
              </Button>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this relationship"
              />
            </div>
          </div>
          
          {/* Existing relationships */}
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Existing Relationships</h3>
            
            {relationships.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No relationships defined for this document.</p>
            ) : (
              <div className="border rounded-md divide-y">
                {relationships.map(rel => {
                  const relatedDoc = documents.find(d => d.id === rel.targetDocumentId);
                  return (
                    <div key={rel.id} className="flex justify-between items-center p-3 hover:bg-muted/30">
                      <div>
                        <div className="font-medium">{relatedDoc?.title || 'Unknown Document'}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="capitalize">{rel.relationshipType}</span>
                          {rel.notes && <span>• {rel.notes}</span>}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveRelationship(rel.id, rel.targetDocumentId)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
