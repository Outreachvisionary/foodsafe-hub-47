
import { CAPAStatus, CAPA } from '@/types/capa';

// Helper function to compare statuses, accounting for format differences
export function isStatusEqual(status1: string, status2?: string): boolean {
  if (!status2) return false;
  
  // Normalize both statuses by replacing underscores with spaces
  const normalizedStatus1 = status1.replace(/_/g, ' ');
  const normalizedStatus2 = status2.replace(/_/g, ' ');
  
  return normalizedStatus1 === normalizedStatus2;
}

// Mock function to update CAPA status
export async function updateCAPAStatus(
  capaId: string, 
  newStatus: CAPAStatus, 
  userId: string
): Promise<CAPA> {
  // In production, this would call the API to update the status
  console.log(`Updating CAPA ${capaId} to status ${newStatus} by user ${userId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock updated CAPA
  return {
    id: capaId,
    title: `CAPA-${capaId}`,
    description: "Updated CAPA description",
    status: newStatus,
    priority: 'High',
    createdAt: new Date().toISOString(),
    createdBy: 'John Doe',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'Jane Smith',
    source: 'Audit',
    sourceReference: 'Audit-2023-001',
    completionDate: newStatus === 'Closed' ? new Date().toISOString() : undefined,
    rootCause: 'Process failure',
    correctiveAction: 'Update process documentation',
    preventiveAction: 'Staff training',
    effectivenessCriteria: 'No recurrence for 90 days',
    effectivenessRating: newStatus === 'Verified' ? 'Effective' : undefined,
    effectivenessVerified: newStatus === 'Verified',
    verificationDate: newStatus === 'Verified' ? new Date().toISOString() : undefined,
    verificationMethod: newStatus === 'Verified' ? 'Review of records' : undefined,
    verifiedBy: newStatus === 'Verified' ? userId : undefined,
    department: 'Quality',
    fsma204Compliant: true,
    relatedDocuments: [],
    relatedTraining: []
  };
}
