
// Simple mapping functions for CAPA status values
export const mapStatusToInternal = (status: string) => {
  switch(status) {
    case 'Open': return 'Open';
    case 'In Progress': return 'In Progress';
    case 'Closed': return 'Closed';
    case 'Overdue': return 'Overdue';
    case 'Verified': 
    case 'Pending Verification': return 'Pending Verification';
    default: return 'Open';
  }
};

export const mapInternalToStatus = (status: string) => {
  // Normalize the status to handle both lowercase and uppercase variants
  const normalizedStatus = status.toLowerCase();
  
  switch(normalizedStatus) {
    case 'open': return 'Open';
    case 'in progress': 
    case 'in-progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'overdue': return 'Overdue';
    case 'pending verification':
    case 'pending-verification': return 'Pending Verification';
    case 'verified': return 'Verified';
    default: return 'Open';
  }
};
