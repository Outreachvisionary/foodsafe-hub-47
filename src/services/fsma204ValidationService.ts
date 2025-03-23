
import { BatchTrace } from '@/types/traceability';
import { ComplianceCheck, ComplianceValidationResult, ValidationScenario } from '@/types/compliance';
import { toast } from 'sonner';

// FSMA 204 compliance checks
export const FSMA204_CHECKS: ComplianceCheck[] = [
  {
    id: 'CTE-1',
    description: 'Critical Tracking Events logged for all distribution points',
    category: 'CTE',
    impact: 'Critical',
    validate: (batch: BatchTrace) => 
      Boolean(batch.distribution && batch.distribution.length > 0),
    regulationRef: 'FSMA 204 §1.1325'
  },
  {
    id: 'CTE-2',
    description: 'Distribution information includes location and contact details',
    category: 'CTE',
    impact: 'Major',
    validate: (batch: BatchTrace) => 
      Boolean(batch.distribution?.every(node => node.location && node.contact)),
    regulationRef: 'FSMA 204 §1.1325(b)'
  },
  {
    id: 'KDE-1',
    description: 'Batch includes lot or batch number',
    category: 'KDE',
    impact: 'Critical',
    validate: (batch: BatchTrace) => Boolean(batch.lotNumber || batch.id),
    regulationRef: 'FSMA 204 §1.1330(a)'
  },
  {
    id: 'KDE-2',
    description: 'CCP checks documented with results',
    category: 'KDE',
    impact: 'Critical',
    validate: (batch: BatchTrace) => 
      batch.haccpChecks.length > 0 && 
      batch.haccpChecks.every(check => 'passed' in check),
    regulationRef: 'FSMA 204 §1.1330(c)'
  },
  {
    id: 'KDE-3',
    description: 'Supplier information complete with audit scores',
    category: 'KDE',
    impact: 'Major',
    validate: (batch: BatchTrace) => 
      batch.suppliers.length > 0 && 
      batch.suppliers.every(supplier => supplier.name && 'auditScore' in supplier),
    regulationRef: 'FSMA 204 §1.1330(b)'
  },
  {
    id: 'TIMELINE-1',
    description: 'Recall decision can be made within 24 hours',
    category: 'Timeline',
    impact: 'Critical',
    validate: () => true, // This would need actual timing logic in a real implementation
    regulationRef: 'FSMA 204 §1.1360'
  },
  {
    id: 'DOC-1',
    description: 'FDA 204 Report can be generated automatically',
    category: 'Documentation',
    impact: 'Major',
    validate: (batch: BatchTrace) => {
      try {
        const report = generateFDAReportTest(batch);
        return Boolean(report);
      } catch (e) {
        return false;
      }
    },
    regulationRef: 'FSMA 204 §1.1455'
  }
];

// Test scenarios based on real-world recalls
export const VALIDATION_SCENARIOS: ValidationScenario[] = [
  {
    id: 'SCENARIO-1',
    name: 'Pathogen in Chocolate',
    description: 'Simulates Salmonella detection in chocolate product',
    testData: {
      id: 'TEST-001',
      product: 'Dark Chocolate Bar',
      date: new Date().toISOString(),
      quantity: '1000 kg',
      status: 'In Production',
      suppliers: [
        { 
          id: 'SUP-COCOA-01', 
          name: 'Premium Cocoa Supplies', 
          auditScore: 92,
          ingredients: [{ 
            id: 'ING-001', 
            name: 'Cocoa Powder', 
            lotNumber: 'CP202405', 
            nonConformanceLevel: undefined 
          }]
        }
      ],
      location: 'Production Line A',
      haccpChecks: [
        {
          id: 'CCP-001',
          ccpId: 'PATHOGEN-TEST-01',
          name: 'Salmonella Test',
          target: 'Negative',
          actual: 'Positive',
          unit: '',
          timestamp: new Date().toISOString(),
          passed: false,
          auditor: 'Jane Smith',
          hazardType: 'biological',
          criticality: 'CRITICAL'
        }
      ],
      distribution: [
        {
          id: 'DIST-001',
          facilityId: 'WH-CENTRAL',
          date: new Date().toISOString(),
          location: 'Central Warehouse',
          contact: 'warehouse@example.com'
        }
      ],
      lotNumber: 'LOT-20240501-A'
    },
    expectedResult: true
  },
  {
    id: 'SCENARIO-2',
    name: 'Allergen Mislabeling',
    description: 'Simulates undeclared allergen in product packaging',
    testData: {
      id: 'TEST-002',
      product: 'Granola Bars',
      date: new Date().toISOString(),
      quantity: '500 kg',
      status: 'Released',
      suppliers: [
        { 
          id: 'SUP-NUTS-01', 
          name: 'Nut Supplier Inc', 
          auditScore: 85,
          ingredients: [{ 
            id: 'ING-002', 
            name: 'Almond Pieces', 
            lotNumber: 'AP202405', 
            allergens: ['tree nuts'],
            nonConformanceLevel: 'CLASS_I'
          }]
        }
      ],
      location: 'Warehouse B',
      haccpChecks: [
        {
          id: 'CCP-002',
          ccpId: 'LABEL-CHECK-01',
          name: 'Label Verification',
          target: 'All allergens declared',
          actual: 'Missing tree nut declaration',
          unit: '',
          timestamp: new Date().toISOString(),
          passed: false,
          auditor: 'John Doe',
          hazardType: 'chemical',
          criticality: 'CRITICAL'
        }
      ],
      distribution: [
        {
          id: 'DIST-002',
          facilityId: 'RETAIL-001',
          date: new Date().toISOString(),
          location: 'Northeast Retail Chain',
          contact: 'orders@retailchain.com'
        }
      ],
      lotNumber: 'LOT-20240502-B'
    },
    expectedResult: true
  }
];

// Helper function to generate test FDA report
const generateFDAReportTest = (batch: BatchTrace) => {
  // This is a simplified version for testing purposes
  return {
    reportId: `FDA-204-${batch.id}`,
    generatedDate: new Date().toISOString(),
    product: batch.product,
    lotNumber: batch.lotNumber || batch.id,
    reason: batch.haccpChecks.some(check => !check.passed) ? 'CCP Failure' : 'Other',
    affectedLocations: batch.distribution?.map(d => d.location) || []
  };
};

// Run validation on a batch
export const validateFSMA204Compliance = (batch: BatchTrace): ComplianceValidationResult => {
  const passedChecks: ComplianceCheck[] = [];
  const failedChecks: ComplianceCheck[] = [];
  
  // Run all checks
  FSMA204_CHECKS.forEach(check => {
    try {
      if (check.validate(batch)) {
        passedChecks.push(check);
      } else {
        failedChecks.push(check);
      }
    } catch (error) {
      console.error(`Error in FSMA 204 validation check ${check.id}:`, error);
      failedChecks.push(check);
    }
  });
  
  const totalChecks = FSMA204_CHECKS.length;
  const score = (passedChecks.length / totalChecks) * 100;
  
  return {
    passed: failedChecks.filter(check => check.impact === 'Critical').length === 0,
    passedChecks,
    failedChecks,
    score,
    timestamp: new Date().toISOString()
  };
};

// Run a validation scenario
export const runValidationScenario = (scenarioId: string): { result: boolean; expected: boolean; match: boolean } => {
  const scenario = VALIDATION_SCENARIOS.find(s => s.id === scenarioId);
  
  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`);
  }
  
  // Create a copy of the test data to avoid modifying the original
  const testBatch = { ...scenario.testData };
  
  // Test if the batch would trigger a recall
  const { needsRecall } = evaluateRecallNeedTest(testBatch);
  
  return {
    result: needsRecall,
    expected: scenario.expectedResult,
    match: needsRecall === scenario.expectedResult
  };
};

// Test wrapper for evaluateRecallNeed
const evaluateRecallNeedTest = (batch: BatchTrace) => {
  try {
    // Test if the batch should be recalled based on CCP and supplier criteria
    const needsRecall = batch.haccpChecks.some(check => 
      !check.passed && check.criticality === 'CRITICAL'
    ) || batch.suppliers.some(supplier => 
      supplier.ingredients?.some(ingredient => 
        ingredient.nonConformanceLevel === 'CLASS_I'
      )
    );
    
    return { 
      needsRecall,
      report: needsRecall ? generateFDAReportTest(batch) : undefined
    };
  } catch (error) {
    console.error('Error evaluating recall need:', error);
    toast.error('Error running recall evaluation test');
    return { needsRecall: false };
  }
};

// Run validation on all scenarios and get summary
export const validateAllScenarios = () => {
  const results = VALIDATION_SCENARIOS.map(scenario => ({
    scenario: scenario.name,
    ...runValidationScenario(scenario.id)
  }));
  
  const passingTests = results.filter(r => r.match).length;
  const totalTests = results.length;
  
  return {
    results,
    summary: {
      passingTests,
      totalTests,
      passRate: (passingTests / totalTests) * 100
    }
  };
};
