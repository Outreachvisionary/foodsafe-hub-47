
import React, { useState, useEffect } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VersionHistoryItem } from '@/components/documents/version/VersionHistoryItem';
import { CheckoutStatus } from '@/components/documents/version/CheckoutStatus';
import { DocumentAuditTrail } from '@/components/documents/version/DocumentAuditTrail';
import { format } from 'date-fns';
import { Document } from '@/types/document';
import { History, Clock, FileCheck, Download, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DocumentVersionControl: React.FC = () => {
  const { documents, selectedDocument, setSelectedDocument, checkoutDocument, checkinDocument } = useDocuments();
  const [activeTab, setActiveTab] = useState('history');
  const { toast } = useToast();
  
  // Filter only documents with version history or checkout status
  const documentsWithHistory = documents.filter(doc => 
    (doc.versions && doc.versions.length > 1) || doc.is_checked_out
  );
  
  // Handle document selection
  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
  };
  
  // Handle document checkout
  const handleCheckout = () => {
    if (!selectedDocument) return;
    checkoutDocument(selectedDocument);
    toast({
      title: "Document checked out",
      description: `You've successfully checked out ${selectedDocument.title}. You can now make edits.`,
    });
  };
  
  // Handle document check-in
  const handleCheckin = () => {
    if (!selectedDocument) return;
    checkinDocument(selectedDocument);
    toast({
      title: "Document checked in",
      description: `You've successfully checked in ${selectedDocument.title}. Your changes are now available to others.`,
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <History className="h-5 w-5 mr-2 text-primary" />
              Documents with History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentsWithHistory.length > 0 ? (
              <div className="space-y-2">
                {documentsWithHistory.map(doc => (
                  <div 
                    key={doc.id}
                    className={`
                      p-3 rounded-md cursor-pointer transition-colors
                      ${selectedDocument?.id === doc.id ? 'bg-primary/10 border-primary/50' : 'bg-card hover:bg-accent/10'}
                      border
                    `}
                    onClick={() => handleSelectDocument(doc)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {doc.file_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={doc.is_checked_out ? "destructive" : "secondary"} className="text-[10px]">
                          {doc.is_checked_out ? <Lock className="h-2.5 w-2.5 mr-1" /> : <FileCheck className="h-2.5 w-2.5 mr-1" />}
                          {doc.is_checked_out ? 'Checked Out' : `v${doc.version || 1}`}
                        </Badge>
                      </div>
                    </div>
                    {doc.updated_at && (
                      <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Last updated: {format(new Date(doc.updated_at), 'PP')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No documents with version history</p>
                <p className="text-sm mt-1">
                  Documents will appear here once they have multiple versions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2 space-y-4">
        {selectedDocument ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">{selectedDocument.title}</h3>
              <div className="flex items-center gap-2">
                {!selectedDocument.is_checked_out ? (
                  <Button variant="outline" size="sm" onClick={handleCheckout}>
                    <Lock className="h-3.5 w-3.5 mr-1.5" />
                    Check Out
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={handleCheckin}>
                    <Unlock className="h-3.5 w-3.5 mr-1.5" />
                    Check In
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
            
            {selectedDocument.is_checked_out && (
              <CheckoutStatus 
                document={selectedDocument} 
                onCheckin={handleCheckin}
              />
            )}
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="history">Version History</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {selectedDocument.versions && selectedDocument.versions.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDocument.versions
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((version, index) => (
                            <VersionHistoryItem
                              key={index}
                              version={version}
                              isLatest={index === 0}
                            />
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No version history available for this document</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="audit" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    {selectedDocument.activity && selectedDocument.activity.length > 0 ? (
                      <DocumentAuditTrail activities={selectedDocument.activity} />
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No audit trail available for this document</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-medium mb-2">No Document Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a document from the list to view its version history and audit trail
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
