
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Calendar, User } from 'lucide-react';
import { NonConformance } from '@/types/non-conformance';
import { useAuth } from '@/contexts/AuthContext';

interface NCCAPAIntegrationProps {
  nonConformance: NonConformance;
  onCreateCAPA: (ncId: string) => void;
  onLinkCAPA: (ncId: string, capaId: string) => void;
}

// Mock CAPA data - replace with actual data fetching
const mockLinkedCAPAs = [
  {
    id: 'capa-001',
    title: 'Corrective Action for Temperature Control Issue',
    status: 'In Progress',
    assignedTo: 'John Smith',
    dueDate: '2024-02-15',
    priority: 'High'
  },
  {
    id: 'capa-002', 
    title: 'Preventive Action for Supplier Quality',
    status: 'Open',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-03-01',
    priority: 'Medium'
  }
];

const NCCAPAIntegration: React.FC<NCCAPAIntegrationProps> = ({
  nonConformance,
  onCreateCAPA,
  onLinkCAPA
}) => {
  const { user } = useAuth();
  const [linkedCAPAs] = useState(mockLinkedCAPAs);

  const handleCreateCAPA = () => {
    onCreateCAPA(nonConformance.id);
  };

  const handleLinkExistingCAPA = () => {
    // Implementation for linking existing CAPA
    console.log('Link existing CAPA');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
            <Button size="sm" onClick={handleCreateCAPA}>
              <Plus className="h-4 w-4 mr-2" />
              Create CAPA
            </Button>
            <Button size="sm" variant="outline" onClick={handleLinkExistingCAPA}>
              <ExternalLink className="h-4 w-4 mr-2" />
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
            {linkedCAPAs.map((capa) => (
              <div
                key={capa.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-2">{capa.title}</h5>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{capa.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {new Date(capa.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(capa.status)}>
                      {capa.status}
                    </Badge>
                    <Badge className={getPriorityColor(capa.priority)}>
                      {capa.priority}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-4">
              No CAPAs are currently linked to this non-conformance.
            </p>
            <Button onClick={handleCreateCAPA}>
              <Plus className="h-4 w-4 mr-2" />
              Create First CAPA
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCCAPAIntegration;
