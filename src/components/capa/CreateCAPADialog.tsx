import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { createCAPA } from '@/services/capaService';
import { useAuth } from '@/hooks/useAuth';
import { CAPASource, CAPAPriority, CAPAStatus } from '@/types/capa';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, Save, X, Loader2 } from 'lucide-react';

interface InitialData {
  title?: string;
  description?: string;
  source?: CAPASource;
  sourceId?: string;
  priority?: CAPAPriority;
}

interface CreateCAPADialogProps {
  onCAPACreated: (capa: any) => void;
  initialData?: InitialData;
  children?: ReactNode;
}

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({
  onCAPACreated,
  initialData,
  children
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || 'New CAPA',
    description: initialData?.description || '',
    source: initialData?.source || 'other' as CAPASource,
    sourceId: initialData?.sourceId || '',
    priority: initialData?.priority || 'medium' as CAPAPriority
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCAPA = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      const capaData = {
        title: formData.title,
        description: formData.description,
        source: formData.source as CAPASource,
        sourceId: formData.sourceId,
        priority: formData.priority as CAPAPriority,
        status: 'open' as CAPAStatus,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: user?.id || 'system',
        createdBy: user?.id || 'system',
        createdDate: now,
        lastUpdated: now,
        effectivenessVerified: false,
        isFsma204Compliant: false
      };
      
      const result = await createCAPA(capaData);
      onCAPACreated(result);
      toast({
        title: "CAPA Created",
        description: "Your new CAPA has been successfully created",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Error Creating CAPA",
        description: "There was a problem creating your CAPA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create CAPA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">Create CAPA</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            Create a Corrective and Preventive Action from {initialData?.source || 'scratch'}
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter CAPA title"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the issue and corrective action needed"
                className="min-h-[120px] w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-sm font-medium">
                  Source
                </Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => handleChange('source', value)}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="non-conformance">Non-Conformance</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceId" className="text-sm font-medium">
                Source Reference ID
              </Label>
              <Input
                id="sourceId"
                value={formData.sourceId}
                onChange={(e) => handleChange('sourceId', e.target.value)}
                placeholder="Enter reference ID (optional)"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="hover:bg-secondary flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCAPA}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create CAPA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
