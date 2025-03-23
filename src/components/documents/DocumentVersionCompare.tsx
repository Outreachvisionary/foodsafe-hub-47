
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';
import { DocumentVersion } from '@/types/document';

interface DocumentVersionCompareProps {
  oldVersion: DocumentVersion;
  newVersion: DocumentVersion;
}

const DocumentVersionCompare: React.FC<DocumentVersionCompareProps> = ({ 
  oldVersion, 
  newVersion 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Version Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <Badge variant="outline">Version {oldVersion.version}</Badge>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(oldVersion.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <ArrowRight className="h-6 w-6 text-gray-400" />
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <Badge>Version {newVersion.version}</Badge>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(newVersion.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-50 p-2 border-b text-sm font-medium">
            Changes between versions
          </div>
          <div className="p-4">
            <div className="bg-red-50 p-2 mb-2 border-l-2 border-red-400 rounded text-sm">
              <span className="text-red-600 font-medium">- Removed:</span> Section 3.2 on older procedure
            </div>
            <div className="bg-green-50 p-2 mb-2 border-l-2 border-green-400 rounded text-sm">
              <span className="text-green-600 font-medium">+ Added:</span> Section 3.2 with updated procedure
            </div>
            <div className="bg-yellow-50 p-2 border-l-2 border-yellow-400 rounded text-sm">
              <span className="text-yellow-600 font-medium">~ Changed:</span> Section 4.1 references updated
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Change notes: {newVersion.changeNotes || 'No change notes provided'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionCompare;
