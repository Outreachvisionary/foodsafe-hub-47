
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { CAPA } from '@/types/capa';
import { CAPAStatus } from '@/types/enums';

interface LinkedCAPAsListProps {
  capaIds: string[];
}

const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capaIds }) => {
  const [loading, setLoading] = useState(true);
  const [capas, setCapas] = useState<CAPA[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCAPAs = async () => {
      if (!capaIds.length) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const capaPromises = capaIds.map(id => fetchCAPAById(id));
        const resolvedCapas = await Promise.all(capaPromises);
        setCapas(resolvedCapas);
      } catch (error) {
        console.error('Error loading linked CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCAPAs();
  }, [capaIds]);

  const handleViewCAPA = (id: string) => {
    navigate(`/capa/${id}`);
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related CAPAs</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
            <span>Loading CAPAs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!capaIds.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related CAPAs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No related CAPAs found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related CAPAs</CardTitle>
      </CardHeader>
      <CardContent>
        {capas.length === 0 ? (
          <p className="text-gray-500 text-sm">No related CAPAs found.</p>
        ) : (
          <ul className="space-y-4">
            {capas.map((capa) => (
              <li key={capa.id} className="border rounded-md p-4">
                <h4 className="font-medium">{capa.title}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{capa.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="font-medium block">Status:</span>
                    <span>{capa.status.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium block">Priority:</span>
                    <span>{capa.priority}</span>
                  </div>
                  <div>
                    <span className="font-medium block">Created:</span>
                    <span>{new Date(capa.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium block">Created By:</span>
                    <span>{capa.created_by}</span>
                  </div>
                  <div>
                    <span className="font-medium block">Due Date:</span>
                    <span>{new Date(capa.due_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium block">Assigned To:</span>
                    <span>{capa.assigned_to}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleViewCAPA(capa.id)} 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                >
                  View CAPA
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
