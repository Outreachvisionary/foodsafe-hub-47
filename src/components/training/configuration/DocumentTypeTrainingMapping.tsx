
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Book, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import documentToTrainingMapperService from '@/services/documentToTrainingMapperService';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';

const DocumentTypeTrainingMapping: React.FC = () => {
  const [documentCategories, setDocumentCategories] = useState<any[]>([]);
  const [documentStatusTypes, setDocumentStatusTypes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTrainingSessions, setSelectedTrainingSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { sessions, loading: sessionsLoading } = useTrainingSessions();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true);
        
        // Fetch document category types
        const categories = await documentToTrainingMapperService.getDocumentCategoryTypes();
        setDocumentCategories(categories);
        
        // Fetch document status types
        const statusTypes = await documentToTrainingMapperService.getDocumentStatusTypes();
        setDocumentStatusTypes(statusTypes);
      } catch (error) {
        console.error('Error fetching document types:', error);
        toast({
          title: 'Error',
          description: 'Failed to load document types. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentTypes();
  }, [toast]);
  
  useEffect(() => {
    const fetchMappings = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(true);
        
        // Fetch training sessions for this category
        const trainingSessions = await documentToTrainingMapperService.getTrainingSessionsForCategory(selectedCategory);
        
        // Get IDs of mapped sessions
        const mappedSessionIds = trainingSessions.map(session => session.id);
        setSelectedTrainingSessions(mappedSessionIds);
      } catch (error) {
        console.error('Error fetching mappings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMappings();
  }, [selectedCategory]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };
  
  const handleSessionToggle = (sessionId: string) => {
    setSelectedTrainingSessions(prev => {
      if (prev.includes(sessionId)) {
        return prev.filter(id => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  };
  
  const handleSaveMapping = async () => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      
      // Map the category to training sessions
      const success = await documentToTrainingMapperService.mapCategoryToTrainingSessions(
        selectedCategory, 
        selectedTrainingSessions
      );
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Document category to training mapping saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save mapping. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast({
        title: 'Error',
        description: 'Failed to save mapping. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading || sessionsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Book className="h-5 w-5 mr-2" />
          Document Type Training Mapping
        </CardTitle>
        <CardDescription>
          Map document categories to required training sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documentCategories.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No document categories found. Please create document categories first.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Select Document Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a document category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCategory && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Required Training Sessions</label>
                  
                  {sessions.length === 0 ? (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">No training sessions available. Please create training sessions first.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Training Session</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Department</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map(session => (
                          <TableRow key={session.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedTrainingSessions.includes(session.id)}
                                onCheckedChange={() => handleSessionToggle(session.id)}
                              />
                            </TableCell>
                            <TableCell>{session.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{session.training_type}</Badge>
                            </TableCell>
                            <TableCell>{session.department || 'All'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                
                <Button 
                  onClick={handleSaveMapping} 
                  disabled={loading || sessions.length === 0}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Mapping
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentTypeTrainingMapping;
