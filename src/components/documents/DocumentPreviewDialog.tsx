
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Document, DocumentActivity, DocumentActionType } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createDocumentActivity } from '@/services/documentService';
import { useUserRole } from '@/hooks/useUserRole';
import { Eye, Edit, Download, Trash2, Archive, XCircle } from 'lucide-react';

interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

const DocumentPreviewDialog = ({ document, isOpen, onClose, onOpenChange }: DocumentPreviewDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  const [activityLog, setActivityLog] = useState<DocumentActivity | null>(null);

  useEffect(() => {
    if (activityLog) {
      toast({
        title: "Activity Log Created",
        description: `Activity: ${activityLog.action} for document ${document?.title}`,
      });
      setActivityLog(null);
    }
  }, [activityLog, toast, document]);

  const createActivityLog = async (activityData: Omit<DocumentActivity, 'id' | 'timestamp'>) => {
    try {
      const newActivity = await createDocumentActivity(activityData);
      setActivityLog(newActivity);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating activity log",
        description: error.message,
      });
    }
  };

  const handleEditClick = () => {
    // When edit is clicked, create an activity log
    if (document && user) {
      createActivityLog({
        document_id: document.id,
        action: "edit" as DocumentActionType,
        user_id: user.id,
        user_name: user.email || '',
        user_role: userRole?.role_name || 'User',
        comments: `Started editing document ${document.title}`
      });
      
      // Redirect to the edit page
      window.location.href = `/documents/edit/${document.id}`;
    }
  };

  const handleDownloadClick = () => {
    if (document && user) {
      createActivityLog({
        document_id: document.id,
        action: "download" as DocumentActionType,
        user_id: user.id,
        user_name: user.email || '',
        user_role: userRole?.role_name || 'User',
        comments: `Downloaded document ${document.title}`
      });

      // Trigger the download
      window.open(document.file_path, '_blank');
    }
  };

  const handleDeleteClick = () => {
    if (document && user) {
      createActivityLog({
        document_id: document.id,
        action: "delete" as DocumentActionType,
        user_id: user.id,
        user_name: user.email || '',
        user_role: userRole?.role_name || 'User',
        comments: `Deleted document ${document.title}`
      });

      // Implement delete logic here
      toast({
        title: "Document Deleted",
        description: `Document ${document.title} has been deleted.`,
      });
      onClose();
    }
  };

  const handleArchiveClick = () => {
    if (document && user) {
      createActivityLog({
        document_id: document.id,
        action: "archive" as DocumentActionType,
        user_id: user.id,
        user_name: user.email || '',
        user_role: userRole?.role_name || 'User',
        comments: `Archived document ${document.title}`
      });

      // Implement archive logic here
      toast({
        title: "Document Archived",
        description: `Document ${document.title} has been archived.`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document?.title || 'Document Preview'}</DialogTitle>
          <DialogDescription>
            {document?.description || 'Preview and manage document details'}
          </DialogDescription>
        </DialogHeader>

        {document ? (
          <div className="space-y-4">
            <iframe
              src={document.file_path}
              title="Document Preview"
              className="w-full h-[600px]"
            />

            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleDownloadClick}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="secondary" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="outline" onClick={handleArchiveClick}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">No document selected.</p>
          </div>
        )}
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
