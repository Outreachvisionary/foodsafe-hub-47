
// Types for FSMA 204 compliance validation

export interface ComplianceCheck {
  id: string;
  description: string;
  category: 'CTE' | 'KDE' | 'Timeline' | 'Documentation';
  validate: (data: any) => boolean;
  impact: 'Critical' | 'Major' | 'Minor';
  regulationRef?: string;
}

export interface ComplianceValidationResult {
  passed: boolean;
  passedChecks: ComplianceCheck[];
  failedChecks: ComplianceCheck[];
  score: number;
  timestamp: string;
}

export interface ValidationScenario {
  id: string;
  name: string;
  description: string;
  testData: any;
  expectedResult: boolean;
}
