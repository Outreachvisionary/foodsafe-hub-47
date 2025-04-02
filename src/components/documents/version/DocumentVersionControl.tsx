
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Document, DocumentVersion, DocumentActivity } from '@/types/document';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileHistory, Clock, FileLock, FileCheck, History, LockIcon, UnlockIcon, FileText } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { VersionHistoryItem } from './VersionHistoryItem';
import { DocumentAuditTrail } from './DocumentAuditTrail';
import { CheckoutStatus } from './CheckoutStatus';
import { useToast } from '@/hooks/use-toast';

export const DocumentVersionControl: React.FC = () => {
  const { documents, fetchDocuments } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [activities, setActivities] = useState<DocumentActivity[]>([]);
  const [checkedOutDocs, setCheckedOutDocs] = useState<Document[]>([]);
  const { toast } = useToast();

  // Handle search and filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDocs(documents);
    } else {
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(filtered);
    }

    // Filter checked out documents
    const checkedOut = documents.filter(doc => doc.checkout_user_id);
    setCheckedOutDocs(checkedOut);
  }, [documents, searchTerm]);

  // Load document versions and activities when selecting a document
  useEffect(() => {
    if (selectedDocument) {
      // In a real implementation, these would be API calls to fetch the data
      // For now, we'll simulate with dummy data
      const mockVersions: DocumentVersion[] = [
        {
          id: '1',
          document_id: selectedDocument.id,
          version: 3,
          file_name: selectedDocument.file_name,
          file_size: selectedDocument.file_size,
          file_type: selectedDocument.file_type,
          created_by: 'current_user',
          created_at: new Date().toISOString(),
          change_summary: 'Updated content in section 3.2'
        },
        {
          id: '2',
          document_id: selectedDocument.id,
          version: 2,
          file_name: selectedDocument.file_name,
          file_size: selectedDocument.file_size - 1024,
          file_type: selectedDocument.file_type,
          created_by: 'current_user',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          change_summary: 'Minor formatting changes'
        },
        {
          id: '3',
          document_id: selectedDocument.id,
          version: 1,
          file_name: selectedDocument.file_name,
          file_size: selectedDocument.file_size - 2048,
          file_type: selectedDocument.file_type,
          created_by: 'admin',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          change_summary: 'Initial version'
        }
      ];

      const mockActivities: DocumentActivity[] = [
        {
          id: '1',
          document_id: selectedDocument.id,
          action: 'update',
          user_id: 'current_user',
          user_name: 'Current User',
          user_role: 'Editor',
          timestamp: new Date().toISOString(),
          comments: 'Updated document content'
        },
        {
          id: '2',
          document_id: selectedDocument.id,
          action: 'view',
          user_id: 'john_doe',
          user_name: 'John Doe',
          user_role: 'Viewer',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          document_id: selectedDocument.id,
          action: 'create',
          user_id: 'admin',
          user_name: 'Admin User',
          user_role: 'Administrator',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          comments: 'Document created'
        }
      ];

      setVersions(mockVersions);
      setActivities(mockActivities);
    }
  }, [selectedDocument]);

  const handleCheckout = (document: Document) => {
    // In a real implementation, this would be an API call to checkout the document
    toast({
      title: "Document Checked Out",
      description: `You have checked out "${document.title}"`,
    });
    
    // Here we would update the document in the context
  };

  const handleCheckin = (document: Document) => {
    // In a real implementation, this would be an API call to checkin the document
    toast({
      title: "Document Checked In",
      description: `You have checked in "${document.title}"`,
    });
    
    // Here we would update the document in the context
  };

  const compareVersions = (version1: DocumentVersion, version2: DocumentVersion) => {
    toast({
      title: "Comparing Versions",
      description: `Comparing version ${version1.version} with version ${version2.version}`,
    });
    
    // In a real implementation, this would open a diff view of the two versions
  };

  const restoreVersion = (version: DocumentVersion) => {
    toast({
      title: "Version Restored",
      description: `Document has been restored to version ${version.version}`,
    });
    
    // In a real implementation, this would restore the document to the selected version
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="versions" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="versions" className="flex items-center gap-1">
            <FileHistory className="h-4 w-4" />
            Version History
          </TabsTrigger>
          <TabsTrigger value="checkout" className="flex items-center gap-1">
            <FileLock className="h-4 w-4" />
            Check-out Status
            {checkedOutDocs.length > 0 && (
              <Badge variant="secondary" className="ml-1">{checkedOutDocs.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileHistory className="h-5 w-5 mr-2" />
                Document Version History
              </CardTitle>
              <CardDescription>
                View and manage document versions, compare changes, and restore previous versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document List */}
                <div className="lg:col-span-1 border rounded-md">
                  <div className="p-4 border-b">
                    <Label htmlFor="search-versions" className="sr-only">Search Documents</Label>
                    <Input
                      id="search-versions"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="p-1">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map(doc => (
                          <button
                            key={doc.id}
                            className={`w-full text-left p-3 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                              selectedDocument?.id === doc.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <div className="flex items-start">
                              <FileText className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium truncate">
                                  {doc.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {doc.file_name}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    v{doc.version}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {doc.updated_at 
                                      ? `Updated ${formatDistanceToNow(new Date(doc.updated_at))} ago`
                                      : 'No update date'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No documents found</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Version History */}
                <div className="lg:col-span-2 border rounded-md">
                  {selectedDocument ? (
                    <div>
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-medium">{selectedDocument.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDocument.description || 'No description available'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {selectedDocument.status}
                          </Badge>
                          <Badge variant="outline">
                            {selectedDocument.category}
                          </Badge>
                          {selectedDocument.checkout_user_id && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <LockIcon className="h-3 w-3" />
                              Checked Out
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-4 flex justify-between items-center">
                          <h4 className="font-medium">Version History</h4>
                          <div className="flex gap-2">
                            {selectedDocument.checkout_user_id ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCheckin(selectedDocument)}
                                className="flex items-center gap-1"
                              >
                                <UnlockIcon className="h-3 w-3" />
                                Check In
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCheckout(selectedDocument)}
                                className="flex items-center gap-1"
                              >
                                <LockIcon className="h-3 w-3" />
                                Check Out
                              </Button>
                            )}
                          </div>
                        </div>

                        <ScrollArea className="h-[350px]">
                          <div className="space-y-4">
                            {versions.map((version, index) => (
                              <VersionHistoryItem
                                key={version.id}
                                version={version}
                                isLatest={index === 0}
                                onCompare={index < versions.length - 1 ? 
                                  () => compareVersions(version, versions[index + 1]) : 
                                  undefined
                                }
                                onRestore={index > 0 ? 
                                  () => restoreVersion(version) : 
                                  undefined
                                }
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <FileHistory className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Select a Document</h3>
                      <p className="text-center text-muted-foreground mt-1 max-w-md px-4">
                        Choose a document from the list to view its version history,
                        compare changes, and restore previous versions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileLock className="h-5 w-5 mr-2" />
                Check-out Status
              </CardTitle>
              <CardDescription>
                View and manage documents currently checked out for editing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {checkedOutDocs.length > 0 ? (
                <div className="space-y-4">
                  {checkedOutDocs.map(doc => (
                    <CheckoutStatus 
                      key={doc.id} 
                      document={doc} 
                      onCheckin={() => handleCheckin(doc)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Checked Out Documents</h3>
                  <p className="mt-1 text-muted-foreground">
                    All documents are available for editing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <History className="h-5 w-5 mr-2" />
                Document Audit Trail
              </CardTitle>
              <CardDescription>
                View all activities and actions performed on documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document List */}
                <div className="lg:col-span-1 border rounded-md">
                  <div className="p-4 border-b">
                    <Label htmlFor="search-audit" className="sr-only">Search Documents</Label>
                    <Input
                      id="search-audit"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="p-1">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map(doc => (
                          <button
                            key={doc.id}
                            className={`w-full text-left p-3 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                              selectedDocument?.id === doc.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <div className="flex items-start">
                              <FileText className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium truncate">
                                  {doc.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {doc.file_name}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    v{doc.version}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {doc.updated_at 
                                      ? `Updated ${formatDistanceToNow(new Date(doc.updated_at))} ago`
                                      : 'No update date'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No documents found</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Audit Trail */}
                <div className="lg:col-span-2 border rounded-md">
                  {selectedDocument ? (
                    <div>
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-medium">{selectedDocument.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDocument.description || 'No description available'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {selectedDocument.status}
                          </Badge>
                          <Badge variant="outline">
                            {selectedDocument.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-medium mb-4">Document Activity History</h4>
                        <DocumentAuditTrail activities={activities} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <History className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Select a Document</h3>
                      <p className="text-center text-muted-foreground mt-1 max-w-md px-4">
                        Choose a document from the list to view its audit trail
                        and activity history
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
