import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocument } from '@/contexts/DocumentContext';
import { Save, Upload, FileText, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function DocumentEditor() {
  const { 
    documents, 
    loading,
    refreshDocuments = async () => {
      console.error('refreshDocuments not implemented');
    }
  } = useDocument();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('edit');
  const [documentContent, setDocumentContent] = React.useState('');
  const [documentTitle, setDocumentTitle] = React.useState('');
  const [documentCategory, setDocumentCategory] = React.useState('');
  const [documentVersion, setDocumentVersion] = React.useState('1.0');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Document saved",
        description: `${documentTitle} has been saved successfully.`,
      });
      
      // Refresh document list
      await refreshDocuments();
      
    } catch (error) {
      toast({
        title: "Error saving document",
        description: "There was an error saving your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.pdf,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle file upload
        setDocumentTitle(file.name.split('.')[0]);
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded.`,
        });
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Document Editor</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="Enter document title"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sop">Standard Operating Procedure</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="record">Record</SelectItem>
                    <SelectItem value="training">Training Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="1.0"
                  value={documentVersion}
                  onChange={(e) => setDocumentVersion(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit">
                <Textarea
                  placeholder="Enter document content here..."
                  className="min-h-[400px] font-mono"
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                />
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[400px] bg-white">
                  <div className="prose max-w-none">
                    {documentContent ? (
                      <div dangerouslySetInnerHTML={{ __html: documentContent }} />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center justify-center h-[400px]">
                        <FileText className="h-12 w-12 mb-2" />
                        <p>No content to preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="border rounded-md p-4 min-h-[400px] bg-white">
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                    <History className="h-12 w-12 mb-2" />
                    <p>No version history available</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
