
export const mapInternalStatusToDb = (status: string): string => {
  switch (status) {
    case 'Open':
      return 'open';
    case 'In Progress':
      return 'in_progress';
    case 'Completed':
      return 'completed';
    case 'Verified':
      return 'verified';
    case 'Closed':
      return 'closed';
    default:
      return 'open';
  }
};

export const mapDbStatusToInternal = (status: string): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'verified':
      return 'Verified';
    case 'closed':
      return 'Closed';
    default:
      return 'Open';
  }
};

export default {
  mapInternalStatusToDb,
  mapDbStatusToInternal
};
