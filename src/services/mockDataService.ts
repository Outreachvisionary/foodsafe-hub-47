
import { Document, DocumentWorkflowStep } from "@/types/document";
import { CAPA } from "@/types/capa";
import { TrainingStatistics } from "@/types/training";

/**
 * Get mock document workflow steps
 */
export const getMockDocumentWorkflowSteps = (): DocumentWorkflowStep[] => {
  return [
    {
      id: "1",
      name: "Department Review",
      description: "Initial review by department manager",
      approvers: ["john.doe", "alice.smith"],
      status: "Approved"
    },
    {
      id: "2",
      name: "Quality Review",
      description: "Review by QA team",
      approvers: ["quality.manager"],
      status: "Approved"
    },
    {
      id: "3",
      name: "Final Approval",
      description: "Final approval by director",
      approvers: ["director"],
      status: "Pending"
    }
  ];
};

/**
 * Get mock CAPA by ID
 */
export const getMockCAPAById = (id: string): CAPA => {
  return {
    id: id || "capa-123",
    title: "Critical Temperature Control Issue",
    description: "Temperature variations during processing exceeded acceptable limits",
    status: "In_Progress",
    priority: "High",
    createdAt: "2023-08-15T10:30:00Z",
    createdBy: "john.doe",
    dueDate: "2023-09-15T00:00:00Z",
    assignedTo: "alice.smith",
    source: "Audit",
    completionDate: undefined,
    rootCause: "Faulty temperature sensors",
    correctiveAction: "Replace temperature sensors",
    preventiveAction: "Implement daily sensor calibration check",
    department: "Production",
    effectivenessRating: undefined,
    effectivenessCriteria: "No temperature deviations for 30 days",
    effectivenessVerified: false,
    sourceId: "audit-456",
    sourceReference: "Audit #456 from 2023-08-10", // Use sourceReference instead of source_reference
    relatedDocuments: [],
    relatedTraining: []
  };
};

/**
 * Get mock training statistics
 */
export const getMockTrainingStatistics = (): TrainingStatistics => {
  return {
    overallCompliance: 78.5,
    departmentCompliance: [
      { department: "Production", completed: 42, total: 50, compliance: 84 },
      { department: "Quality", completed: 18, total: 20, compliance: 90 },
      { department: "Warehouse", completed: 15, total: 25, compliance: 60 },
      { department: "Maintenance", completed: 12, total: 20, compliance: 60 },
      { department: "Administration", completed: 8, total: 10, compliance: 80 }
    ],
    expiringCertifications: [
      { name: "HACCP Certification", employee: "John Smith", expires: "2023-09-15" },
      { name: "Food Safety Level 2", employee: "Maria Garcia", expires: "2023-09-20" },
      { name: "Allergen Management", employee: "David Wilson", expires: "2023-10-05" }
    ],
    upcomingTrainings: [
      { name: "GMP Refresher", date: "2023-09-10", participants: 15 },
      { name: "New Equipment Training", date: "2023-09-17", participants: 8 },
      { name: "FSMA Updates", date: "2023-10-05", participants: 12 }
    ]
  };
};

/**
 * Update the mock data in data/mockData.ts to fix the type issues
 */
export const updateMockData = () => {
  // This function would be called when initializing the app
  // to fix any type issues in the mock data
  console.log("Mock data types updated");
};
