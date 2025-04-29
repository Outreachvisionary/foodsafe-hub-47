
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";
import { Document } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="h-full cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="font-medium">{document.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{document.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className={getStatusColor(document.status)}>
            {document.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">{document.category}</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {document.created_at && format(new Date(document.created_at), 'MMM d, yyyy')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
