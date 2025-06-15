
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, FolderPlus } from 'lucide-react';

interface EmptyDocumentsStateProps {
  searchTerm: string;
  selectedFolderId: string | null;
  onUpload: () => void;
  onCreateFolder: () => void;
}

const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({
  searchTerm,
  selectedFolderId,
  onUpload,
  onCreateFolder
}) => {
  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        title: "No documents found",
        description: "Try adjusting your search terms or clear the search to see all documents"
      };
    }
    
    if (selectedFolderId) {
      return {
        title: "This folder is empty",
        description: "Upload documents or move existing documents here."
      };
    }
    
    return {
      title: "No documents found",
      description: "Get started by uploading your first document or creating a new folder"
    };
  };

  const { title, description } = getEmptyMessage();

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        {!searchTerm && (
          <div className="flex justify-center gap-3">
            <Button onClick={onUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <Button onClick={onCreateFolder} variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyDocumentsState;
