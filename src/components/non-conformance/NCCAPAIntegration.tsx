import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Link2, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Clock,
  User,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NonConformance } from '@/types/non-conformance';
import { useNCCAPAIntegration } from '@/hooks/useNCCAPAIntegration';
import { useCAPAs } from '@/hooks/useCAPAs';
import { toast } from 'sonner';

interface NCCAPAIntegrationProps {
  nonConformance: NonConformance;
  onCAPAGenerated?: () => void;
}

const NCCAPAIntegration: React.FC<NCCAPAIntegrationProps> = ({
  nonConformance,
  onCAPAGenerated
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showCustomCAPADialog, setShowCustomCAPADialog] = useState(false);
  const [selectedCAPAId, setSelectedCAPAId] = useState('');
  const [customCAPAData, setCustomCAPAData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assigned_to: '',
    due_date: '',
    root_cause: '',
    corrective_action: '',
    preventive_action: ''
  });

  const {
    linkedCAPAs,
    availableCAPAs,
    isLoadingLinkedCAPAs,
    isLoadingAvailableCAPAs,
    generateCAPA,
    linkCAPA,
    isGeneratingCAPA,
    isLinkingCAPA
  } = useNCCAPAIntegration(nonConformance.id || '');

  const { createCAPA, isCreating } = useCAPAs();

  const handleAutoGenerateCAPA = async () => {
    try {
      await generateCAPA({ isAutomatic: true });
      toast.success('CAPA generated automatically from non-conformance');
      onCAPAGenerated?.();
    } catch (error) {
      toast.error('Failed to generate CAPA automatically');
    }
  };

  const handleManualGenerateCAPA = async () => {
    try {
      await generateCAPA({ isAutomatic: false });
      toast.success('Manual CAPA template created');
      onCAPAGenerated?.();
    } catch (error) {
      toast.error('Failed to create CAPA template');
    }
  };

  const handleLinkExistingCAPA = async () => {
    if (!selectedCAPAId) {
      toast.error('Please select a CAPA to link');
      return;
    }

    try {
      await linkCAPA(selectedCAPAId);
      setShowLinkDialog(false);
      setSelectedCAPAId('');
      toast.success('CAPA linked successfully');
    } catch (error) {
      toast.error('Failed to link CAPA');
    }
  };

  const handleCreateCustomCAPA = async () => {
    if (!customCAPAData.title) {
      toast.error('Please enter a title for the CAPA');
      return;
    }

    try {
      const capaData = {
        title: customCAPAData.title,
        description: customCAPAData.description,
        priority: customCAPAData.priority as any, // Type cast to match CAPA interface
        assigned_to: customCAPAData.assigned_to,
        created_by: 'Current User', // In real app, get from auth
        source: 'Non_Conformance' as any,
        source_id: nonConformance.id,
        department: nonConformance.department,
        due_date: customCAPAData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        root_cause: customCAPAData.root_cause,
        corrective_action: customCAPAData.corrective_action,
        preventive_action: customCAPAData.preventive_action
      };

      await createCAPA(capaData);
      setShowCustomCAPADialog(false);
      setCustomCAPAData({
        title: '',
        description: '',
        priority: 'Medium',
        assigned_to: '',
        due_date: '',
        root_cause: '',
        corrective_action: '',
        preventive_action: ''
      });
      toast.success('Custom CAPA created and linked');
      onCAPAGenerated?.();
    } catch (error) {
      toast.error('Failed to create custom CAPA');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-warning text-warning-foreground';
      case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* CAPA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link2 className="h-5 w-5" />
            <span>CAPA Integration Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedCAPAs && linkedCAPAs.length > 0 ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This non-conformance has {linkedCAPAs.length} linked CAPA(s).
                </AlertDescription>
              </Alert>
              
              {linkedCAPAs.map((linkedCapa: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{linkedCapa.capa_actions?.title}</h4>
                            <Badge className={getStatusColor(linkedCapa.capa_actions?.status)}>
                              {linkedCapa.capa_actions?.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {linkedCapa.capa_actions?.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{linkedCapa.capa_actions?.assigned_to}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Due: {formatDate(linkedCapa.capa_actions?.due_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="h-3 w-3" />
                              <span>Priority: {linkedCapa.capa_actions?.priority}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          View CAPA
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No CAPA is currently linked to this non-conformance. Consider generating or linking a CAPA to address this issue.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* CAPA Generation Options */}
      {(!linkedCAPAs || linkedCAPAs.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Create or Link CAPA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auto Generate CAPA */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Auto Generate CAPA</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically create a CAPA based on this non-conformance using AI analysis
                      </p>
                    </div>
                    <Button 
                      onClick={handleAutoGenerateCAPA}
                      disabled={isGeneratingCAPA}
                      className="w-full"
                    >
                      {isGeneratingCAPA ? 'Generating...' : 'Auto Generate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Template */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto">
                      <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manual Template</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create a basic CAPA template that you can customize manually
                      </p>
                    </div>
                    <Button 
                      onClick={handleManualGenerateCAPA}
                      disabled={isGeneratingCAPA}
                      variant="outline"
                      className="w-full"
                    >
                      {isGeneratingCAPA ? 'Creating...' : 'Create Template'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center space-x-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Link Existing CAPA */}
              <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto">
                          <Link2 className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-medium">Link Existing CAPA</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Connect this NC to an existing CAPA action
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          Link Existing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Link Existing CAPA</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select CAPA to Link</Label>
                      <Select value={selectedCAPAId} onValueChange={setSelectedCAPAId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a CAPA..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCAPAs?.map((capa: any) => (
                            <SelectItem key={capa.id} value={capa.id}>
                              {capa.title} - {capa.status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleLinkExistingCAPA}
                        disabled={isLinkingCAPA || !selectedCAPAId}
                      >
                        {isLinkingCAPA ? 'Linking...' : 'Link CAPA'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Custom CAPA */}
              <Dialog open={showCustomCAPADialog} onOpenChange={setShowCustomCAPADialog}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Create Custom CAPA</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create a fully customized CAPA action
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          Create Custom
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Custom CAPA</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={customCAPAData.title}
                          onChange={(e) => setCustomCAPAData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter CAPA title"
                        />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select 
                          value={customCAPAData.priority} 
                          onValueChange={(value) => setCustomCAPAData(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={customCAPAData.description}
                        onChange={(e) => setCustomCAPAData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the CAPA action"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Assigned To</Label>
                        <Input
                          value={customCAPAData.assigned_to}
                          onChange={(e) => setCustomCAPAData(prev => ({ ...prev, assigned_to: e.target.value }))}
                          placeholder="Enter assignee"
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={customCAPAData.due_date}
                          onChange={(e) => setCustomCAPAData(prev => ({ ...prev, due_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Root Cause Analysis</Label>
                      <Textarea
                        value={customCAPAData.root_cause}
                        onChange={(e) => setCustomCAPAData(prev => ({ ...prev, root_cause: e.target.value }))}
                        placeholder="Describe the root cause"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Corrective Action</Label>
                      <Textarea
                        value={customCAPAData.corrective_action}
                        onChange={(e) => setCustomCAPAData(prev => ({ ...prev, corrective_action: e.target.value }))}
                        placeholder="Describe the corrective action"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Preventive Action</Label>
                      <Textarea
                        value={customCAPAData.preventive_action}
                        onChange={(e) => setCustomCAPAData(prev => ({ ...prev, preventive_action: e.target.value }))}
                        placeholder="Describe the preventive action"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCustomCAPADialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateCustomCAPA}
                        disabled={isCreating || !customCAPAData.title}
                      >
                        {isCreating ? 'Creating...' : 'Create CAPA'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CAPA Benefits & Information */}
      <Card>
        <CardHeader>
          <CardTitle>Why Link a CAPA?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Benefits of CAPA Integration:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Systematic root cause analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Prevent recurrence of issues</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Regulatory compliance tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Automated workflow management</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Auto-Generation Features:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>AI-powered root cause suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Predefined corrective actions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Risk-based prioritization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Cross-module data integration</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NCCAPAIntegration;