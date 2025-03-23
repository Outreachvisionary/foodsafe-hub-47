
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import DocumentRepository from '@/components/documents/DocumentRepository';
import ApprovalWorkflow from '@/components/documents/ApprovalWorkflow';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import DocumentTemplates from '@/components/documents/DocumentTemplates';
import DocumentEditor from '@/components/documents/DocumentEditor';
import { 
  FileText, 
  ClipboardCheck, 
  CalendarX, 
  FilePlus, 
  Upload,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import { Document } from '@/types/document';

// Sample document for editing demo
const sampleDocument: Document = {
  id: "sample-1",
  title: "Raw Material Receiving SOP",
  fileName: "raw_material_receiving_sop_v3.pdf",
  fileSize: 2456000,
  fileType: "application/pdf",
  category: "SOP",
  status: "Draft",
  version: 3,
  createdBy: "John Doe",
  createdAt: "2023-04-15T10:30:00Z",
  updatedAt: "2023-06-20T14:15:00Z",
  expiryDate: "2024-06-20T14:15:00Z",
  linkedModule: "haccp",
  tags: ['receiving', 'materials', 'procedures'],
  description: "## 1. Purpose\n\nThis Standard Operating Procedure (SOP) establishes guidelines for receiving raw materials to ensure compliance with food safety standards.\n\n## 2. Scope\n\nThis procedure applies to all incoming raw materials at all facilities.\n\n## 3. Responsibilities\n\n- **Receiving Personnel**: Inspect and document incoming materials\n- **QA Manager**: Verify compliance with specifications\n- **Operations Manager**: Ensure proper storage\n\n## 4. Procedure\n\n### 4.1 Pre-Receiving Activities\n\n1. Review purchase orders\n2. Prepare receiving area\n3. Verify calibration of measuring equipment\n\n### 4.2 Receiving Inspection\n\n1. Inspect delivery vehicle for cleanliness\n2. Check temperature of refrigerated/frozen items\n3. Verify packaging integrity\n4. Check for pest activity\n\n### 4.3 Documentation\n\n1. Complete receiving log with date, time, supplier\n2. Record lot numbers and quantities\n3. Document any non-conformances\n\n## 5. Records\n\n- Receiving logs\n- Non-conformance reports\n- Supplier certificates of analysis\n\n## 6. References\n\n- FDA Food Safety Modernization Act (FSMA)\n- Company Food Safety Plan\n- HACCP Plan"
};

const Documents = () => {
  const [activeTab, setActiveTab] = useState('repository');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(sampleDocument);

  const handleSaveDocument = (updatedDoc: Document) => {
    // In a real app, this would save the document to the backend
    setCurrentDocument(updatedDoc);
    console.log('Document saved:', updatedDoc);
  };

  const handleSubmitForReview = (doc: Document) => {
    // In a real app, this would submit the document for review
    setCurrentDocument(doc);
    console.log('Document submitted for review:', doc);
    setActiveTab('approvals');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Document Management" 
        subtitle="Centralized repository for all compliance documentation with version control and approval workflows" 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-semibold">Document Control System</h2>
          <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
        
        <Tabs defaultValue="repository" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Document Repository</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Approval Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <CalendarX className="h-4 w-4" />
              <span>Expiring Documents</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Document Editor</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repository">
            <DocumentRepository />
          </TabsContent>
          
          <TabsContent value="approvals">
            <ApprovalWorkflow />
          </TabsContent>
          
          <TabsContent value="expired">
            <ExpiredDocuments />
          </TabsContent>
          
          <TabsContent value="templates">
            <DocumentTemplates />
          </TabsContent>
          
          <TabsContent value="edit">
            <DocumentEditor 
              document={currentDocument} 
              onSave={handleSaveDocument}
              onSubmitForReview={handleSubmitForReview}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <UploadDocumentDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
      />
    </div>
  );
};

export default Documents;
