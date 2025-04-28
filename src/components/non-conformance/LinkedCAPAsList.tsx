
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { CAPA } from '@/types/capa';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { convertToCAPAStatus } from '@/utils/typeAdapters';

interface LinkedCapasProps {
  capaIds: string[];
  nonConformanceId?: string;
}

const LinkedCAPAsList: React.FC<LinkedCapasProps> = ({ capaIds, nonConformanceId }) => {
  const navigate = useNavigate();
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapas = async () => {
      if (!capaIds || capaIds.length === 0) {
        setCapas([]);
        setLoading(false);
        return;
      }

      try {
        const capaPromises = capaIds.map(async (id) => {
          const capaData = await fetchCAPAById(id);
          
          // Transform to match the CAPA interface
          return {
            id: capaData.id,
            title: capaData.title,
            description: capaData.description,
            status: convertToCAPAStatus(capaData.status),
            priority: capaData.priority,
            createdAt: capaData.created_at,
            createdBy: capaData.created_by,
            dueDate: capaData.due_date,
            assignedTo: capaData.assigned_to,
            source: capaData.source,
            completionDate: capaData.completion_date,
            rootCause: capaData.root_cause,
            correctiveAction: capaData.corrective_action,
            preventiveAction: capaData.preventive_action,
            effectivenessCriteria: capaData.effectiveness_criteria,
            effectivenessRating: capaData.effectiveness_rating,
            effectivenessVerified: capaData.effectiveness_verified,
            sourceId: capaData.source_id,
            sourceReference: capaData.source_reference || '', // Changed from source_reference to sourceReference
            verificationDate: capaData.verification_date,
            verificationMethod: capaData.verification_method,
            verifiedBy: capaData.verified_by,
            department: capaData.department,
            fsma204Compliant: capaData.fsma204_compliant,
            relatedDocuments: [],
            relatedTraining: []
          } as CAPA;
        });

        const fetchedCapas = await Promise.all(capaPromises);
        setCapas(fetchedCapas);
      } catch (error) {
        console.error('Error fetching linked CAPAs:', error);
        setError('Failed to fetch CAPA data');
      } finally {
        setLoading(false);
      }
    };

    fetchCapas();
  }, [capaIds]);

  const viewCapa = (id: string) => {
    navigate(`/capa/${id}`);
  };

  const createCapa = () => {
    navigate(`/capa/new?sourceType=NonConformance&sourceId=${nonConformanceId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related CAPAs</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading CAPAs...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related CAPAs</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related CAPAs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {capas.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="mb-4">No CAPAs linked to this non-conformance</p>
            {nonConformanceId && (
              <Button onClick={createCapa} size="sm">Create CAPA</Button>
            )}
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {capas.map((capa) => (
                <li 
                  key={capa.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => viewCapa(capa.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{capa.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                        <Badge variant={capa.status === 'Open' ? 'outline' : 'secondary'}>
                          {capa.status.replace(/_/g, ' ')}
                        </Badge>
                        <span>Priority: {capa.priority}</span>
                        <span>Due: {new Date(capa.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </li>
              ))}
            </ul>
            {nonConformanceId && (
              <div className="p-4 border-t text-center">
                <Button onClick={createCapa} size="sm">Create Another CAPA</Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
