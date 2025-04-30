
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, Bot } from 'lucide-react';
import { CAPAPriority, CAPASource } from '@/types/enums';
import CreateCAPADialog from './CreateCAPADialog';

// Mock AI service response
interface AIGeneratedCAPA {
  title: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  priority: CAPAPriority;
  source: CAPASource;
  dueDate: string;
}

const AutomatedCAPAGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCAPA, setGeneratedCAPA] = useState<AIGeneratedCAPA | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter details to generate a CAPA');
      return;
    }
    
    try {
      setGenerating(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const priority = getPriorityBasedOnContent(input);
      
      setGeneratedCAPA({
        title: `CAPA for ${input.split(' ').slice(0, 3).join(' ')}...`,
        description: `This CAPA was automatically generated based on the input: "${input}"`,
        rootCause: generateRootCause(input),
        correctiveAction: generateCorrectiveAction(input),
        preventiveAction: generatePreventiveAction(input),
        priority,
        source: getSourceBasedOnContent(input),
        dueDate: getDefaultDueDate()
      });
    } catch (err) {
      setError('Failed to generate CAPA. Please try again.');
      console.error('Error generating CAPA:', err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleCreateCAPA = (data: any) => {
    console.log('Creating CAPA with data:', data);
    setCreateDialogOpen(false);
    setGeneratedCAPA(null);
    setInput('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Automated CAPA Generator
        </CardTitle>
        <CardDescription>
          Describe an issue, incident, or observation to automatically generate a CAPA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="space-y-4">
          <TabsList>
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="document">Document Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Describe the issue, incident, or non-conformance in detail..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerate}
                disabled={generating || !input.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate CAPA'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="document" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-muted-foreground mb-2">Upload a document to extract CAPA details</p>
              <Input type="file" className="max-w-sm mx-auto" />
            </div>
            
            <div className="flex justify-end">
              <Button disabled={true}>
                Upload & Generate
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {generatedCAPA && (
          <div className="mt-6 border rounded-md p-4">
            <h3 className="font-medium mb-3">Generated CAPA</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{generatedCAPA.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{generatedCAPA.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p className="font-medium">{generatedCAPA.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium">{generatedCAPA.source}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Root Cause</p>
                <p>{generatedCAPA.rootCause}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Corrective Action</p>
                <p>{generatedCAPA.correctiveAction}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Preventive Action</p>
                <p>{generatedCAPA.preventiveAction}</p>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  variant="default"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create CAPA
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CreateCAPADialog 
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCAPACreated={handleCreateCAPA}
        />
      </CardContent>
    </Card>
  );
};

// Helper functions for generating CAPA content
const getPriorityBasedOnContent = (content: string): CAPAPriority => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('danger') || 
      lowerContent.includes('severe') || 
      lowerContent.includes('critical') || 
      lowerContent.includes('urgent') ||
      lowerContent.includes('safety')) {
    return CAPAPriority.Critical;
  } else if (lowerContent.includes('important') || 
             lowerContent.includes('significant') || 
             lowerContent.includes('major')) {
    return CAPAPriority.High;
  } else if (lowerContent.includes('moderate') || 
             lowerContent.includes('standard')) {
    return CAPAPriority.Medium;
  } else {
    return CAPAPriority.Low;
  }
};

const getSourceBasedOnContent = (content: string): CAPASource => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('audit') || lowerContent.includes('inspection')) {
    return CAPASource.Audit;
  } else if (lowerContent.includes('customer') || lowerContent.includes('complaint')) {
    return CAPASource.CustomerComplaint;
  } else if (lowerContent.includes('supplier') || lowerContent.includes('vendor')) {
    return CAPASource.SupplierIssue;
  } else if (lowerContent.includes('regulation') || lowerContent.includes('compliance')) {
    return CAPASource.RegulatoryInspection;
  } else if (lowerContent.includes('non-conform') || lowerContent.includes('nonconform')) {
    return CAPASource.NonConformance;
  } else if (lowerContent.includes('internal') || lowerContent.includes('report')) {
    return CAPASource.InternalReport;
  } else {
    return CAPASource.Other;
  }
};

const generateRootCause = (input: string): string => {
  // This would use AI in a real implementation
  return `Based on the description, the root cause appears to be related to ${input.split(' ').slice(-3).join(' ')}. Further investigation may be needed.`;
};

const generateCorrectiveAction = (input: string): string => {
  // This would use AI in a real implementation
  return `Implement immediate measures to address the ${input.split(' ').slice(0, 2).join(' ')} and ensure that the process returns to compliance.`;
};

const generatePreventiveAction = (input: string): string => {
  // This would use AI in a real implementation
  return `Develop and implement a standardized procedure for ${input.split(' ').slice(0, 3).join(' ')} to prevent recurrence. Conduct training for relevant staff.`;
};

const getDefaultDueDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 14); // 2 weeks from now
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export default AutomatedCAPAGenerator;
