
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getCAPAById } from '@/services/capa/capaFetchService';
import { CAPA } from '@/types/capa';

interface LinkedCAPAsListProps {
  capaIds: string[];
}

export const LinkedCAPAsList: React.FC<LinkedCAPAsListProps> = ({ capaIds }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCapas = async () => {
      if (!capaIds || capaIds.length === 0) return;
      
      setLoading(true);
      try {
        const capaPromises = capaIds.map(id => getCAPAById(id));
        const capaResults = await Promise.all(capaPromises);
        setCapas(capaResults.filter(Boolean));
      } catch (error) {
        console.error('Error fetching linked CAPAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCapas();
  }, [capaIds]);
  
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading linked CAPAs...</p>;
  }
  
  if (!capaIds || capaIds.length === 0 || capas.length === 0) {
    return <p className="text-sm text-muted-foreground">No linked CAPAs</p>;
  }
  
  return (
    <div className="space-y-2">
      {capas.map(capa => (
        <div 
          key={capa.id}
          className="flex justify-between items-center p-2 border rounded-md"
        >
          <div>
            <p className="font-medium">{capa.title}</p>
            <p className="text-xs text-muted-foreground">CAPA #{capa.id.slice(0, 8)}</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/capa/${capa.id}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkedCAPAsList;
