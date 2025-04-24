
// Simple mapping function for CAPA status values
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
