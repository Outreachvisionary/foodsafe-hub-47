
import { ComplaintStatus } from '@/types/document';

export const mapStatusToInternal = (status: string): ComplaintStatus => {
  const formattedStatus = status.replace(' ', '_') as ComplaintStatus;
  
  if (
    formattedStatus === 'New' ||
    formattedStatus === 'Under_Investigation' ||
    formattedStatus === 'Resolved' ||
    formattedStatus === 'Closed' ||
    formattedStatus === 'Reopened'
  ) {
    return formattedStatus;
  }
  
  if (formattedStatus === 'Under-Investigation' || formattedStatus === 'UnderInvestigation') {
    return 'Under_Investigation';
  }
  
  console.warn(`Unknown status format: ${status}, defaulting to New`);
  return 'New';
};

export default {
  mapStatusToInternal
};
