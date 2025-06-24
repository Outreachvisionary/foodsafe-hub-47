
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users
} from 'lucide-react';

interface DashboardMetricsProps {
  complaints: number;
  capas: number;
  nonConformances: number;
  documents: number;
  loading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  complaints,
  capas,
  nonConformances,
  documents,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Non-Conformances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nonConformances}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            CAPAs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{capas}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{documents}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
