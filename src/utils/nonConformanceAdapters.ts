
import { NCStatus, NCRiskLevel, NCCategory, NCItemCategory, NCReasonCategory } from '@/types/non-conformance';
import { NonConformance } from '@/types/non-conformance';

// Non-conformance status conversion functions
export const ncStatusToString = (status: NCStatus | string): string => {
  if (typeof status === 'string') return status;
  return String(status);
};

export const stringToNCStatus = (status: string): NCStatus => {
  // Normalize the status string to match the NCStatus enum format
  const normalizedStatus = status.replace(/ /g, '_').toUpperCase();
  return normalizedStatus as unknown as NCStatus;
};

// Risk level conversion functions
export const riskLevelToString = (riskLevel: NCRiskLevel | string): string => {
  if (typeof riskLevel === 'string') return riskLevel;
  return String(riskLevel);
};

export const stringToRiskLevel = (riskLevel: string): NCRiskLevel => {
  const normalizedRiskLevel = riskLevel.toUpperCase();
  return normalizedRiskLevel as unknown as NCRiskLevel;
};

// Helper function to convert a NonConformance object for API
export const adaptNCForAPI = (nc: Partial<NonConformance>): Record<string, any> => {
  return {
    ...nc,
    status: ncStatusToString(nc.status as NCStatus | string),
    risk_level: nc.risk_level ? riskLevelToString(nc.risk_level as NCRiskLevel | string) : undefined
  };
};

// Helper function to convert API response to NonConformance object
export const adaptAPIToNC = (data: Record<string, any>): NonConformance => {
  return {
    ...data,
    status: stringToNCStatus(data.status),
    risk_level: data.risk_level ? stringToRiskLevel(data.risk_level) : undefined
  } as NonConformance;
};
