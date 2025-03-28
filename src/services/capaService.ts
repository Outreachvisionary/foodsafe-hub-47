
// Export all CAPA services from this central file
import { fetchCAPAs, fetchCAPAById } from './capa/capaFetchService';
import { createCAPA, updateCAPA, deleteCAPA } from './capa/capaUpdateService';
import { getCAPAStats } from './capa/capaStatsService';
import { mapStatusToDb, mapStatusFromDb } from './capa/capaStatusService';

export {
  fetchCAPAs,
  fetchCAPAById,
  createCAPA,
  updateCAPA,
  deleteCAPA,
  getCAPAStats,
  mapStatusToDb,
  mapStatusFromDb
};
