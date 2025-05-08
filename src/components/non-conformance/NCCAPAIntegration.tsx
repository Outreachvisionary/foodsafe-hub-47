
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, Plus, RefreshCcw, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createCAPAFromNC, getRelatedCAPAs, linkCAPAToNC } from '@/services/integrationService';
import { useAuth } from '@/hooks/useAuth'; 
import { supabase } from '@/integrations/supabase/client';

interface NCCAPAIntegrationProps {
  nonConformanceId: string;
}

interface CAPA {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  assigned_to: string;
}

const NCCAPAIntegration: React.FC<NCCAPAIntegrationProps> = ({ nonConformanceId }) => {
  const [relatedCAPAs, setRelatedCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const [availableCAPAs, setAvailableCAPAs] = useState<CAPA[]>([]);
  const [selectedCAPAId, setSelectedCAPAId] = useState<string>('');
  const [creatingCAPA, setCreatingCAPA] = useState<boolean>(false);
  
  // In a real app, this would come from a proper auth context
  // For now we'll use a placeholder or get from the auth hook if it exists
  const user = useAuth()?.user || { id: 'system-user' };
  const userId = typeof user === 'object' && 'id' in user ? user.id : 'system-user';
  
  const fetchRelatedCAPAs = async () => {
    setLoading(true);
    setError(null);
    try {
      const capas = await getRelatedCAPAs(nonConformanceId);
      setRelatedCAPAs(capas);
    } catch (err) {
      console.error('Error fetching related CAPAs:', err);
      setError('Failed to load related CAPAs');
      toast.error('Failed to load related CAPAs');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCAPA = async () => {
    try {
      setCreatingCAPA(true);
      await createCAPAFromNC(nonConformanceId, userId);
      toast.success('CAPA created successfully');
      fetchRelatedCAPAs(); // Refresh the list
    } catch (err) {
      console.error('Error creating CAPA:', err);
      toast.error('Failed to create CAPA');
    } finally {
      setCreatingCAPA(false);
    }
  };
  
  const handleLinkCAPA = async () => {
    if (!selectedCAPAId) {
      toast.error('Please select a CAPA to link');
      return;
    }
    
    try {
      await linkCAPAToNC(nonConformanceId, selectedCAPAId, userId);
      toast.success('CAPA linked successfully');
      setShowLinkDialog(false);
      fetchRelatedCAPAs(); // Refresh the list
    } catch (err) {
      console.error('Error linking CAPA:', err);
      toast.error('Failed to link CAPA');
    }
  };
  
  const fetchAvailableCAPAs = async () => {
    try {
      // Get CAPAs that are not already linked to this NC
      const { data, error } = await supabase
        .from('capa_actions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter out CAPAs that are already linked to this NC
      const linkedCapaIds = relatedCAPAs.map(capa => capa.id);
      const availableCAPAs = data?.filter(capa => !linkedCapaIds.includes(capa.id)) || [];
      
      setAvailableCAPAs(availableCAPAs);
    } catch (err) {
      console.error('Error fetching available CAPAs:', err);
      toast.error('Failed to load available CAPAs');
    }
  };
  
  useEffect(() => {
    fetchRelatedCAPAs();
  }, [nonConformanceId]);
  
  // Load available CAPAs when the dialog is opened
  useEffect(() => {
    if (showLinkDialog) {
      fetchAvailableCAPAs();
    }
  }, [showLinkDialog]);
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Related CAPAs</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRelatedCAPAs}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LinkIcon className="h-4 w-4 mr-1" />
                Link Existing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Existing CAPA</DialogTitle>
                <DialogDescription>
                  Select an existing CAPA to link to this Non-Conformance
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select
                  value={selectedCAPAId}
                  onValueChange={setSelectedCAPAId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a CAPA" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCAPAs.map((capa) => (
                      <SelectItem key={capa.id} value={capa.id}>
                        {capa.title}
                      </SelectItem>
                    ))}
                    {availableCAPAs.length === 0 && (
                      <SelectItem value="none" disabled>
                        No available CAPAs
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleLinkCAPA} disabled={!selectedCAPAId}>
                  Link CAPA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            onClick={handleCreateCAPA}
            disabled={creatingCAPA}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create CAPA
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : relatedCAPAs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No CAPAs linked to this Non-Conformance</p>
            <p className="text-sm mt-1">Create a new CAPA or link an existing one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {relatedCAPAs.map((capa) => (
              <div key={capa.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{capa.title}</h3>
                    <p className="text-sm text-gray-500">{capa.description}</p>
                  </div>
                  <Badge className={getStatusColor(capa.status)}>
                    {capa.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Priority:</span>{' '}
                    <span className="font-medium">{capa.priority}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Due:</span>{' '}
                    <span className="font-medium">
                      {new Date(capa.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>{' '}
                    <span className="font-medium">
                      {new Date(capa.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Assigned to:</span>{' '}
                    <span className="font-medium">{capa.assigned_to}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-end">
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                  >
                    <a href={`/capa/${capa.id}`} className="flex items-center">
                      View CAPA
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCCAPAIntegration;
