
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { StandardName, StandardRequirement } from '@/types/supplier';

interface StandardRequirementsProps {
  standard: StandardName;
}

// Mock standard-specific requirements
const requirementsByStandard: Record<StandardName, StandardRequirement[]> = {
  'SQF': [
    { standard: 'SQF', name: 'SQFI Certification', description: 'Valid certification from SQFI', category: 'Documentation' },
    { standard: 'SQF', name: 'Food Defense Plan', description: 'Documented food defense protocols', category: 'Security' },
    { standard: 'SQF', name: 'Mock Recall Program', description: 'Ability to conduct mock recalls within 2 hours', category: 'Traceability' },
  ],
  'BRC GS2': [
    { standard: 'BRC GS2', name: 'Allergen Controls', description: 'Documented allergen management program', category: 'Food Safety' },
    { standard: 'BRC GS2', name: 'Site Security', description: 'Physical security measures documented', category: 'Security' },
    { standard: 'BRC GS2', name: 'Product Testing', description: 'Regular microbiological testing program', category: 'Quality' },
  ],
  'ISO 22000': [
    { standard: 'ISO 22000', name: 'HACCP Plan', description: 'Documented hazard analysis', category: 'Food Safety' },
    { standard: 'ISO 22000', name: 'Management Review', description: 'Regular reviews of FSMS', category: 'Management' },
    { standard: 'ISO 22000', name: 'Corrective Actions', description: 'Process for addressing non-conformities', category: 'Compliance' },
  ],
  'FSSC 22000': [
    { standard: 'FSSC 22000', name: 'Environmental Monitoring', description: 'Program for production environment testing', category: 'Food Safety' },
    { standard: 'FSSC 22000', name: 'Food Fraud Mitigation', description: 'Documented vulnerability assessment', category: 'Security' },
    { standard: 'FSSC 22000', name: 'Food Defense', description: 'Threat assessment and mitigation plan', category: 'Security' },
  ],
  'HACCP': [
    { standard: 'HACCP', name: 'Hazard Analysis', description: 'Identification of biological, chemical, physical hazards', category: 'Food Safety' },
    { standard: 'HACCP', name: 'CCP Monitoring', description: 'Procedures for monitoring critical control points', category: 'Monitoring' },
    { standard: 'HACCP', name: 'Verification Activities', description: 'Regular verification of HACCP system', category: 'Validation' },
  ],
  'all': [] // Empty placeholder for the "all" option
};

const StandardRequirements: React.FC<StandardRequirementsProps> = ({ standard }) => {
  if (standard === 'all') {
    return null;
  }

  const requirements = requirementsByStandard[standard] || [];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">{standard} Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div key={index} className="p-3 border rounded-md">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{req.name}</h3>
                <div className="flex space-x-1">
                  <span className="text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{req.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                  {req.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardRequirements;
