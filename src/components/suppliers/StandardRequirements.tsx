
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { StandardName, StandardRequirement } from '@/types/supplier';
import { fetchStandardRequirements } from '@/services/standardRequirementsService';
import { toast } from 'sonner';

interface StandardRequirementsProps {
  standard: StandardName;
}

const StandardRequirements: React.FC<StandardRequirementsProps> = ({ standard }) => {
  const [requirements, setRequirements] = useState<StandardRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRequirements = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchStandardRequirements(standard);
        setRequirements(data);
      } catch (err) {
        console.error(`Error loading requirements for ${standard}:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to load ${standard} requirements`));
        toast.error(`Failed to load ${standard} requirements`);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequirements();
  }, [standard]);

  // Group requirements by category
  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, StandardRequirement[]>);

  if (isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clipboard className="mr-2 h-5 w-5" />
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-500">
            <Clipboard className="mr-2 h-5 w-5" />
            Error Loading Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          {standard} Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-20rem)]">
        {Object.keys(groupedRequirements).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedRequirements).map(([category, reqs]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-500">{category}</h3>
                <ul className="space-y-2">
                  {reqs.map((req, idx) => (
                    <li key={idx} className="text-sm border-l-2 border-primary pl-3 py-1">
                      <span className="font-medium">{req.name}</span>
                      <p className="text-gray-600 text-xs mt-1">{req.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No specific requirements found for {standard}.</p>
            <p className="text-sm mt-2">Requirements will be displayed here when available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandardRequirements;
