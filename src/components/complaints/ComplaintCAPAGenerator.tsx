
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { useComplaintCAPAIntegration } from '@/hooks/useComplaintCAPAIntegration';

interface ComplaintCAPAGeneratorProps {
  complaint: Complaint;
  onCAPAGenerated?: () => void;
}

const ComplaintCAPAGenerator: React.FC<ComplaintCAPAGeneratorProps> = ({
  complaint,
  onCAPAGenerated
}) => {
  const {
    generateCAPA,
    isGeneratingCAPA
  } = useComplaintCAPAIntegration(complaint.id);

  const handleGenerateCAPA = () => {
    generateCAPA('current-user'); // TODO: Get from auth context
    onCAPAGenerated?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CAPA Integration</span>
          <Button 
            size="sm" 
            onClick={handleGenerateCAPA}
            disabled={isGeneratingCAPA || !!complaint.capa_id}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate CAPA
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {complaint.capa_id ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">CAPA Generated</span>
            </div>
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">CAPA for Complaint: {complaint.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically generated CAPA to address this complaint
                  </p>
                  <Badge variant="outline" className="mt-2">
                    ID: {complaint.capa_id}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View CAPA
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              No CAPA is currently linked to this complaint.
            </p>
            <Button onClick={handleGenerateCAPA} disabled={isGeneratingCAPA}>
              <Plus className="h-4 w-4 mr-2" />
              {isGeneratingCAPA ? 'Generating CAPA...' : 'Generate CAPA'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will create a new CAPA to address the issues identified in this complaint
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintCAPAGenerator;
