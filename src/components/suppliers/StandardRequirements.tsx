
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { StandardName } from '@/types/supplier';
import { supabase } from '@/integrations/supabase/client';

interface StandardRequirement {
  id: string;
  standard: string;
  name: string;
  description: string;
  category: string;
}

interface StandardRequirementsProps {
  standard: StandardName;
}

const StandardRequirements: React.FC<StandardRequirementsProps> = ({ standard }) => {
  const [requirements, setRequirements] = useState<StandardRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('standard_requirements')
          .select('*')
          .eq('standard', standard);
          
        if (error) throw error;
        
        setRequirements(data || []);
      } catch (error) {
        console.error('Error fetching standard requirements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequirements();
  }, [standard]);

  // Fallback content for empty database
  const getFallbackRequirements = () => {
    switch(standard) {
      case 'SQF':
        return [
          { id: '1', standard: 'SQF', name: 'Food Safety Plan', category: 'Documentation', description: 'Comprehensive HACCP-based food safety plan' },
          { id: '2', standard: 'SQF', name: 'Management Responsibility', category: 'Leadership', description: 'Commitment from senior management' },
          { id: '3', standard: 'SQF', name: 'Food Safety System', category: 'System', description: 'Documented system for food safety' }
        ];
      case 'BRC GS2':
        return [
          { id: '1', standard: 'BRC GS2', name: 'Senior Management Commitment', category: 'Leadership', description: 'Demonstrated commitment to standard' },
          { id: '2', standard: 'BRC GS2', name: 'Food Safety Plan', category: 'Documentation', description: 'HACCP-based plan' },
          { id: '3', standard: 'BRC GS2', name: 'Site Standards', category: 'Facilities', description: 'Physical standards for safety' }
        ];
      case 'FSSC 22000':
        return [
          { id: '1', standard: 'FSSC 22000', name: 'Management System', category: 'System', description: 'Food safety management system' },
          { id: '2', standard: 'FSSC 22000', name: 'PRPs', category: 'Prerequisites', description: 'Prerequisite programs' },
          { id: '3', standard: 'FSSC 22000', name: 'HACCP', category: 'Documentation', description: 'HACCP principles and critical control points' }
        ];
      default:
        return [];
    }
  };

  const displayRequirements = requirements.length > 0 ? requirements : getFallbackRequirements();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
          {standard} Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRequirements.map((requirement) => (
              <div key={requirement.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-medium">{requirement.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {requirement.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {requirement.description}
                </p>
              </div>
            ))}
            {displayRequirements.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No requirements found for {standard}
              </div>
            )}
            <div className="text-center mt-4">
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                View full {standard} standard <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandardRequirements;
