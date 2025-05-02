import { NCStatus, DocumentStatus, CAPAStatus } from '@/types/enums';

export function ncStatusToString(status: NCStatus): string {
  return status.toString();
}

export function isStatusEqual(status1: string | NCStatus | null, status2: string | NCStatus | null): boolean {
  if (status1 === null || status2 === null) return false;
  
  const s1 = typeof status1 === 'string' ? status1 : status1.toString();
  const s2 = typeof status2 === 'string' ? status2 : status2.toString();
  
  return s1 === s2;
}

export function isStringStatusEqual(status1: string | null, status2: string | null): boolean {
  if (status1 === null || status2 === null) return false;
  return status1 === status2;
}

export function formatEnumValue(value: string): string {
  if (!value) return '';
  
  // Replace underscores with spaces
  const withSpaces = value.replace(/_/g, ' ');
  
  // Format camelCase or snake_case to Title Case
  return withSpaces.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export function isDocumentStatusEqual(status1: string | DocumentStatus | null, status2: string | DocumentStatus | null): boolean {
  if (status1 === null || status2 === null) return false;
  
  const s1 = typeof status1 === 'string' ? status1 : status1.toString();
  const s2 = typeof status2 === 'string' ? status2 : status2.toString();
  
  return s1 === s2;
}

export function convertToCAPAStatus(statusString: string): CAPAStatus {
  // Map the string value to CAPAStatus enum
  switch(statusString) {
    case "Open":
      return CAPAStatus.Open;
    case "In Progress":
      return CAPAStatus.InProgress;
    case "Pending Verification":
      return CAPAStatus.PendingVerification;
    case "Verified":
      return CAPAStatus.Verified;
    case "Closed":
      return CAPAStatus.Closed;
    case "Overdue":
      return CAPAStatus.Overdue;
    default:
      return CAPAStatus.Open; // Default to Open
  }
}
