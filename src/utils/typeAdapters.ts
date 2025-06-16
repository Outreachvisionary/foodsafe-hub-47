
export const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status comparison utilities
export const isStringStatusEqual = (status1: string, status2: string): boolean => {
  return status1.toLowerCase() === status2.toLowerCase();
};

export const isStatusEqual = (status1: any, status2: any): boolean => {
  return String(status1).toLowerCase() === String(status2).toLowerCase();
};

// Effectiveness rating utilities
export const effectivenessRatingToString = (rating: any): string => {
  return String(rating).replace(/_/g, ' ');
};

// Training status utilities
export const trainingStatusToString = (status: any): string => {
  return String(status).replace(/_/g, ' ');
};

export const stringToTrainingStatus = (status: string): any => {
  return status.replace(/ /g, '_');
};
