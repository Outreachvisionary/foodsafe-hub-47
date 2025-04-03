
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, DocumentSummary, DocumentVersion } from '@/types/document';
import { Bot, RefreshCcw, FileText, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface DocumentAISummaryProps {
  document: Document;
  version?: DocumentVersion;
}

export const DocumentAISummary: React.FC<DocumentAISummaryProps> = ({
  document,
  version
}) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // In a real implementation, we would fetch the summary from the backend
    // For now, simulate checking if a summary exists for this document
    const hasSummary = document.has_ai_summary;
    
    if (hasSummary) {
      setLoading(true);
      
      // Simulate API call delay
      const timer = setTimeout(() => {
        // Mock data for demonstration
        const mockSummary: DocumentSummary = {
          id: `summary-${document.id}`,
          documentId: document.id,
          versionId: version?.id || document.current_version_id || '',
          summary: `This document covers the key processes and procedures for ${document.title}. It includes sections on responsibilities, procedural steps, and compliance requirements.`,
          keyPoints: [
            'Establishes formal procedures for document control',
            'Defines roles and responsibilities for document management',
            'Outlines approval process and requirements',
            'Includes guidance for document revision and updates'
          ],
          generated_at: new Date().toISOString(),
          modelUsed: 'gpt-4'
        };
        
        setSummary(mockSummary);
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [document, version]);

  const handleGenerateSummary = () => {
    setGenerating(true);
    
    // Simulate generating summary
    toast({
      title: "Generating Summary",
      description: "AI is analyzing the document content..."
    });
    
    // Simulate API call delay
    setTimeout(() => {
      const newSummary: DocumentSummary = {
        id: `summary-${document.id}-${Date.now()}`,
        documentId: document.id,
        versionId: version?.id || document.current_version_id || '',
        summary: `This ${document.category} titled "${document.title}" establishes guidelines and procedures for document management and control. It covers document creation, review, approval, and distribution processes.`,
        keyPoints: [
          'Defines document approval workflow steps',
          'Establishes document categorization system',
          'Details retention requirements and schedules',
          'Outlines revision control procedures'
        ],
        generated_at: new Date().toISOString(),
        modelUsed: 'gpt-4'
      };
      
      setSummary(newSummary);
      setGenerating(false);
      
      toast({
        title: "Summary Generated",
        description: "AI has completed the document analysis"
      });
    }, 3000);
  };

  const handleRefreshSummary = () => {
    setGenerating(true);
    
    toast({
      title: "Refreshing Summary",
      description: "Analyzing updated document content..."
    });
    
    // Simulate API call
    setTimeout(() => {
      const refreshedSummary: DocumentSummary = {
        ...summary!,
        generated_at: new Date().toISOString(),
        summary: `This ${document.category} document "${document.title}" details comprehensive processes for document management and control. It establishes structured procedures for creating, reviewing, approving, and maintaining organizational documents.`,
        keyPoints: [
          ...summary!.keyPoints,
          'Includes updated compliance references',
          'Adds integration with training requirements'
        ]
      };
      
      setSummary(refreshedSummary);
      setGenerating(false);
      
      toast({
        title: "Summary Refreshed",
        description: "AI has completed the updated analysis"
      });
    }, 2500);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          AI Document Summary
        </CardTitle>
        <CardDescription>
          Automatically generated summary and key points of this document
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Key Points</h3>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
            </div>
          </div>
        ) : summary ? (
          <>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium">Executive Summary</h3>
                <Badge variant="outline" className="text-xs">
                  Version {version?.version || document.version}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <ListChecks className="h-4 w-4 mr-1 text-muted-foreground" />
                Key Points
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              Generated on {new Date(summary.generated_at).toLocaleString()} • Model: {summary.modelUsed}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No AI Summary Available</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Generate an AI-powered summary to quickly understand the key points and content of this document.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        {summary ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshSummary}
            disabled={generating}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            Refresh Summary
          </Button>
        ) : (
          <Button 
            onClick={handleGenerateSummary}
            disabled={generating}
          >
            <Bot className="h-4 w-4 mr-2" />
            Generate Summary
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
