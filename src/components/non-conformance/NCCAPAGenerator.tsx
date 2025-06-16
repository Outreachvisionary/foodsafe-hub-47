
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, Link, Plus, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { NonConformance } from '@/types/non-conformance';
import { generateCAPAFromNC, linkCAPAToNC, getLinkedCAPAs } from '@/services/nonConformanceService';
import { getCAPAs } from '@/services/capaService';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface NCCAPAGeneratorProps {
  nonConformance: NonConformance;
  onCAPAGenerated?: (capaId: string) => void;
}

const NCCAPAGenerator: React.FC<NCCAPAGeneratorProps> = ({
  nonConformance,
  onCAPAGenerated
}) => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedCAPAId, setSelectedCAPAId] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch linked CAPAs
  const { data: linkedCAPAs = [], refetch: refetchLinkedCAPAs } = useQuery({
    queryKey: ['linked-capas', nonConformance.id],
    queryFn: () => getLinkedCAPAs(nonConformance.id),
  });

  // Fetch available CAPAs for linking
  const { data: availableCAPAs = [] } = useQuery({
    queryKey: ['available-capas'],
    queryFn: () => getCAPAs(),
    enabled: showLinkDialog,
  });

  // Generate CAPA mutation
  const generateCAPAMutation = useMutation({
    mutationFn: ({ isAutomatic }: { isAutomatic: boolean }) =>
      generateCAPAFromNC(nonConformance.id, isAutomatic),
    onSuccess: (capa) => {
      toast.success('CAPA generated successfully');
      setShowGenerateDialog(false);
      refetchLinkedCAPAs();
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
      onCAPAGenerated?.(capa.id);
    },
    onError: (error: any) => {
      toast.error(`Failed to generate CAPA: ${error.message}`);
    },
  });

  // Link CAPA mutation
  const linkCAPAMutation = useMutation({
    mutationFn: (capaId: string) => linkCAPAToNC(nonConformance.id, capaId),
    onSuccess: () => {
      toast.success('CAPA linked successfully');
      setShowLinkDialog(false);
      setSelectedCAPAId('');
      refetchLinkedCAPAs();
      queryClient.invalidateQueries({ queryKey: ['non-conformances'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to link CAPA: ${error.message}`);
    },
  });

  const handleGenerateCAPA = (isAutomatic: boolean) => {
    generateCAPAMutation.mutate({ isAutomatic });
  };

  const handleLinkCAPA = () => {
    if (selectedCAPAId) {
      linkCAPAMutation.mutate(selectedCAPAId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In_Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CAPA Integration</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setShowGenerateDialog(true)}
              disabled={generateCAPAMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate CAPA
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowLinkDialog(true)}
              disabled={linkCAPAMutation.isPending}
            >
              <Link className="h-4 w-4 mr-2" />
              Link Existing
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {linkedCAPAs.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              Linked CAPAs ({linkedCAPAs.length})
            </h4>
            {linkedCAPAs.map((link: any) => (
              <div
                key={link.target_id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-2">{link.capa_actions.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      {link.capa_actions.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Assigned to: {link.capa_actions.assigned_to}</span>
                      <span>•</span>
                      <span>Due: {new Date(link.capa_actions.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(link.capa_actions.status)}>
                      {link.capa_actions.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {link.relationship_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View CAPA
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              No CAPAs are currently linked to this non-conformance.
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" onClick={() => setShowGenerateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate CAPA
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(true)}>
                <Link className="h-4 w-4 mr-2" />
                Link Existing
              </Button>
            </div>
          </div>
        )}

        {/* Generate CAPA Dialog */}
        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate CAPA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose how you want to generate the CAPA for this non-conformance:
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateCAPA(true)}
                  disabled={generateCAPAMutation.isPending}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Automatic Generation</div>
                    <div className="text-xs text-muted-foreground">
                      AI-powered CAPA with pre-filled actions
                    </div>
                  </div>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateCAPA(false)}
                  disabled={generateCAPAMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Manual Generation</div>
                    <div className="text-xs text-muted-foreground">
                      Create empty CAPA to fill manually
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link Existing CAPA Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Link Existing CAPA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select an existing CAPA to link to this non-conformance:
              </p>
              <Select value={selectedCAPAId} onValueChange={setSelectedCAPAId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a CAPA" />
                </SelectTrigger>
                <SelectContent>
                  {availableCAPAs.map((capa: any) => (
                    <SelectItem key={capa.id} value={capa.id}>
                      <div className="flex items-center gap-2">
                        <span>{capa.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {capa.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLinkCAPA}
                  disabled={!selectedCAPAId || linkCAPAMutation.isPending}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link CAPA
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NCCAPAGenerator;
