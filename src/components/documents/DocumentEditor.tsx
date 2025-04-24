import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileIcon, CheckCircle, History, FileText } from 'lucide-react';
import { useDocumentContext } from '@/context/DocumentContext';
import { DocumentCheckoutActions } from './DocumentCheckoutActions';
import { DocumentVersionHistory } from '@/components/documents/DocumentVersionHistory';

export const DocumentEditor = () => {
  const { selectedDocument, refreshDocuments } = useDocumentContext();
  const [activeTab, setActiveTab] = useState('preview');
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  if (!selectedDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Document Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a document from the list to view or edit it
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">{selectedDocument.title}</h2>
          <p className="text-gray-500">{selectedDocument.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setShowVersionHistory(true)}
          >
            <History className="h-4 w-4" /> 
            Version History
          </Button>

          <DocumentCheckoutActions 
            document={selectedDocument} 
            onUpdate={refreshDocuments} 
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="preview" className="h-full">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg p-12">
                  <div className="text-center">
                    <FileIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">
                      {selectedDocument.file_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {(selectedDocument.file_size / 1024).toFixed(2)} KB • {selectedDocument.file_type}
                    </p>
                    <div className="mt-4">
                      <Button>
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p>{selectedDocument.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p>{selectedDocument.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p>{new Date(selectedDocument.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Version</h3>
                    <p>{selectedDocument.version}</p>
                  </div>
                  {selectedDocument.expiry_date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                      <p>{new Date(selectedDocument.expiry_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedDocument.checkout_status === 'Checked_Out' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Checked Out By</h3>
                      <p>{selectedDocument.checkout_user_name}</p>
                    </div>
                  )}
                </div>

                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDocument.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardContent className="p-6">
                {selectedDocument.status === 'Pending_Approval' ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Pending Approval</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Awaiting approval from:</p>
                          <ul className="mt-2 space-y-1">
                            {selectedDocument.approvers?.map((approver, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                                {approver}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Reject</Button>
                      <Button variant="default">Approve</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No Pending Approvals</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      This document is not currently in an approval workflow
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {selectedDocument && (
        <DocumentVersionHistory
          document={selectedDocument}
          open={showVersionHistory}
          onOpenChange={setShowVersionHistory}
        />
      )}
    </div>
  );
};
