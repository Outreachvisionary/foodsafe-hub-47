
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { DocumentVersion } from '@/types/document';
import { getMockDocumentVersions } from '@/utils/documentVersionUtils';
import { format } from 'date-fns';
import { Download, Calendar, FileText, History, Info, CalendarClock } from 'lucide-react';

interface DocumentVersionHistoryProps {
  documentId: string;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({ documentId }) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        setLoading(true);
        
        // Get mock document versions
        const data = getMockDocumentVersions(documentId);
        
        setVersions(data);
      } catch (error) {
        console.error('Error fetching document versions:', error);
        setError('Failed to load document version history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVersionHistory();
  }, [documentId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>Loading version history...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>Error loading version history</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>List of previous versions of this document</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="divide-y divide-border">
            {versions.map((version) => (
              <div key={version.id} className="flex items-center px-4 py-3 hover:bg-secondary/50 transition-colors">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Version {version.version}</p>
                  <p className="text-xs text-muted-foreground">
                    {version.change_summary || 'No summary'}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>
                    <CalendarClock className="h-3 w-3 inline-block mr-1 align-middle" />
                    {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p>By: {version.created_by}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
