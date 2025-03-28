
// Export all CAPA services from this central file
import { fetchCAPAs, fetchCAPAById } from './capa/capaFetchService';
import { createCAPA, updateCAPA, deleteCAPA } from './capa/capaUpdateService';
import { 
  getCAPAStats, 
  getAdvancedCAPAMetrics, 
  saveEffectivenessMetrics, 
  getEffectivenessMetrics,
  getPotentialCAPAs 
} from './capa/capaStatsService';
import { 
  mapStatusToDb, 
  mapStatusFromDb, 
  isOverdue,
  updateOverdueStatus 
} from './capa/capaStatusService';
import {
  logCAPAActivity,
  getCAPAActivities
} from './capa/capaActivityService';

export {
  fetchCAPAs,
  fetchCAPAById,
  createCAPA,
  updateCAPA,
  deleteCAPA,
  getCAPAStats,
  getAdvancedCAPAMetrics,
  mapStatusToDb,
  mapStatusFromDb,
  isOverdue,
  updateOverdueStatus,
  saveEffectivenessMetrics,
  getEffectivenessMetrics,
  getPotentialCAPAs,
  logCAPAActivity,
  getCAPAActivities
};
