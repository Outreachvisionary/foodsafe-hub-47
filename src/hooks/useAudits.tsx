
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAudits, 
  fetchAuditById, 
  createAudit, 
  updateAudit, 
  deleteAudit,
  fetchAuditFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  exportAuditReport
} from '@/services/auditService';
import { Audit, AuditFinding } from '@/types/audit';

export const useAudits = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load all audits
  const loadAudits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAudits();
      setAudits(data);
    } catch (err) {
      setError('Failed to load audits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific audit
  const loadAudit = useCallback(async (auditId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditById(auditId);
      if (data) {
        // Create a fully compliant Audit object by ensuring all required properties exist
        const completeAudit: Audit = {
          id: data.id,
          title: data.title || 'Untitled Audit',
          status: data.status || 'Open',
          startDate: data.startDate || new Date().toISOString(),
          dueDate: data.dueDate || new Date().toISOString(),
          auditType: data.auditType || 'Internal',
          assignedTo: data.assignedTo || '',
          createdBy: data.createdBy || '',
          // Include any other properties that might be in the data
          ...data 
        };
        
        setSelectedAudit(completeAudit);
        loadFindings(auditId);
      }
      return data;
    } catch (err) {
      setError('Failed to load audit details');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load findings for an audit
  const loadFindings = useCallback(async (auditId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditFindings(auditId);
      setFindings(data);
      return data;
    } catch (err) {
      setError('Failed to load audit findings');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new audit
  const addAudit = useCallback(async (auditData: Omit<Audit, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createAudit(auditData);
      if (data) {
        setAudits(prev => [data as Audit, ...prev]);
      }
      return data;
    } catch (err) {
      setError('Failed to create audit');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing audit
  const editAudit = useCallback(async (auditId: string, auditData: Partial<Audit>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateAudit(auditId, auditData);
      if (data) {
        setAudits(prev => prev.map(audit => 
          audit.id === auditId ? {...audit, ...auditData} : audit
        ));
        if (selectedAudit && selectedAudit.id === auditId) {
          setSelectedAudit(prev => prev ? {...prev, ...auditData} : prev);
        }
      }
      return data;
    } catch (err) {
      setError('Failed to update audit');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedAudit]);

  // Delete an audit
  const removeAudit = useCallback(async (auditId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteAudit(auditId);
      if (success) {
        setAudits(prev => prev.filter(audit => audit.id !== auditId));
        if (selectedAudit && selectedAudit.id === auditId) {
          setSelectedAudit(null);
        }
      }
      return success;
    } catch (err) {
      setError('Failed to delete audit');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedAudit]);

  // Add a finding to an audit
  const addFinding = useCallback(async (finding: Omit<AuditFinding, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createFinding(finding);
      if (data) {
        setFindings(prev => [data as AuditFinding, ...prev]);
        if (selectedAudit && selectedAudit.id === finding.auditId) {
          setSelectedAudit(prev => {
            if (!prev) return prev;
            return {
              ...prev, 
              findings: (prev.findings || 0) + 1
            };
          });
        }
        setAudits(prev => prev.map(audit => 
          audit.id === finding.auditId 
            ? {...audit, findings: (audit.findings || 0) + 1} 
            : audit
        ));
      }
      return data;
    } catch (err) {
      setError('Failed to add finding');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedAudit]);

  // Update a finding
  const editFinding = useCallback(async (findingId: string, findingData: Partial<AuditFinding>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateFinding(findingId, findingData);
      if (data) {
        setFindings(prev => prev.map(finding => 
          finding.id === findingId ? {...finding, ...findingData} : finding
        ));
      }
      return data;
    } catch (err) {
      setError('Failed to update finding');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a finding
  const removeFinding = useCallback(async (findingId: string, auditId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteFinding(findingId);
      if (success) {
        setFindings(prev => prev.filter(finding => finding.id !== findingId));
        if (selectedAudit && selectedAudit.id === auditId) {
          setSelectedAudit(prev => {
            if (!prev) return prev;
            return {
              ...prev, 
              findings: Math.max(0, (prev.findings || 0) - 1)
            };
          });
        }
        setAudits(prev => prev.map(audit => 
          audit.id === auditId 
            ? {...audit, findings: Math.max(0, (audit.findings || 0) - 1)} 
            : audit
        ));
      }
      return success;
    } catch (err) {
      setError('Failed to delete finding');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedAudit]);

  // Export audit report
  const exportReport = useCallback(async (auditId: string, format: 'pdf' | 'excel' = 'pdf') => {
    setLoading(true);
    setError(null);
    try {
      const data = await exportAuditReport(auditId, format);
      return data;
    } catch (err) {
      setError('Failed to export audit report');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load audits on initial component mount
  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  return {
    audits,
    selectedAudit,
    findings,
    loading,
    error,
    loadAudits,
    loadAudit,
    loadFindings,
    addAudit,
    editAudit,
    removeAudit,
    addFinding,
    editFinding,
    removeFinding,
    exportReport,
    setSelectedAudit
  };
};
