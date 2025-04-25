
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CAPA } from '@/types/capa';
import { fetchCAPAById } from '@/services/capa/capaFetchService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/ui/status-badge';

const LinkedCAPAsList = ({ capaIds }: { capaIds: string[] }) => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedCAPAs = async () => {
      if (!capaIds || capaIds.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const capaPromises = capaIds.map(id => fetchCAPAById(id));
        const fetchedCapas = await Promise.all(capaPromises);
        setCapas(fetchedCapas);
      } catch (error) {
        console.error('Error fetching linked CAPAs:', error);
        setError('Failed to load linked CAPA items');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedCAPAs();
  }, [capaIds]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center">
            <div className="animate-spin mr-2">
              <Loader2 size={16} />
            </div>
            Loading Linked CAPAs...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!capaIds || capaIds.length === 0 || capas.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-foreground-muted">No linked CAPA items found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Linked CAPAs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {capas.map((capa) => (
            <li key={capa.id} className="px-4 py-3 hover:bg-secondary/30 transition-colors">
              <Link to={`/capa/${capa.id}`} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{capa.title}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <StatusBadge status={capa.status} />
                    <span className="text-xs text-foreground-muted">
                      {new Date(capa.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-foreground-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LinkedCAPAsList;
