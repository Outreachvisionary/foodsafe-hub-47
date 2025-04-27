
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { CAPA, CAPAStatus } from '@/types/capa';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { convertToCAPAStatus } from '@/utils/typeAdapters';

interface CAPAStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export const CAPAStatusBadge: React.FC<CAPAStatusBadgeProps> = ({ status, showIcon = false }) => {
  return <Badge variant="outline">{status}</Badge>;
};

interface LinkedCAPAsListProps {
  caption?: string;
  capaIds: string[];
  showViewAll?: boolean;
  sourceType?: string;
  sourceId?: string;
  emptyMessage?: string;
  onCreateCAPAClick?: () => void;
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({
  caption = 'Related CAPAs',
  capaIds,
  showViewAll = true,
  sourceType,
  sourceId,
  emptyMessage = 'No CAPAs found',
  onCreateCAPAClick
}) => {
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
        setLoading(true);
        setError(null);

        const capaPromises = capaIds.map(async (id) => {
          const capaData = await fetchCAPAById(id);
          
          // Add an empty string for source_reference if it doesn't exist
          const sourceReference = capaData.source_reference || '';
          
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
            sourceReference: sourceReference,
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
        setError('Failed to load linked CAPA items');
      } finally {
        setLoading(false);
      }
    };

    fetchCapas();
  }, [capaIds]);

  const viewCapa = (id: string) => {
    navigate(`/capa/${id}`);
  };
  
  const viewAllCapas = () => {
    if (sourceType) {
      navigate(`/capa?source=${sourceType}${sourceId ? `&sourceId=${sourceId}` : ''}`);
    } else {
      navigate(`/capa`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{caption}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading CAPAs...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{caption}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!capas || capas.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{caption}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-gray-500">
          {emptyMessage}
          {onCreateCAPAClick && (
            <div className="mt-4">
              <Button size="sm" onClick={onCreateCAPAClick}>
                Create CAPA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{caption}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {capas.map((capa) => (
            <div key={capa.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => viewCapa(capa.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{capa.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{capa.description}</p>
                  <div className="flex gap-2 mt-2">
                    <CAPAStatusBadge status={capa.status.toString().replace(/_/g, ' ')} showIcon={false} />
                    {capa.source && (
                      <Badge variant="outline" className="text-xs">
                        {capa.source}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        {showViewAll && capas.length > 0 && (
          <div className="p-3 border-t text-center">
            <Button variant="ghost" size="sm" onClick={viewAllCapas}>
              View All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
