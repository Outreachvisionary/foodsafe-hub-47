
import { useState, useCallback } from 'react';
import { CrudService, CrudOptions, ExportOptions, ImportOptions } from '@/services/crudService';
import { toast } from 'sonner';

export interface UseCrudOptions {
  table: string;
  defaultSelect?: string;
  defaultOrderBy?: { column: string; ascending?: boolean };
  onSuccess?: (action: string, data?: any) => void;
  onError?: (action: string, error: any) => void;
}

export const useCrud = (options: UseCrudOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { table, defaultSelect, defaultOrderBy, onSuccess, onError } = options;

  const handleSuccess = useCallback((action: string, data?: any) => {
    setError(null);
    onSuccess?.(action, data);
    toast.success(`${action} completed successfully`);
  }, [onSuccess]);

  const handleError = useCallback((action: string, err: any) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    onError?.(action, err);
    toast.error(`${action} failed: ${errorMessage}`);
  }, [onError]);

  const fetchRecords = useCallback(async (customOptions?: Partial<CrudOptions>) => {
    setLoading(true);
    try {
      const fetchOptions: CrudOptions = {
        table,
        select: defaultSelect || '*',
        orderBy: defaultOrderBy,
        ...customOptions,
      };
      
      const data = await CrudService.fetchRecords(fetchOptions);
      handleSuccess('Fetch');
      return data;
    } catch (err) {
      handleError('Fetch', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [table, defaultSelect, defaultOrderBy, handleSuccess, handleError]);

  const createRecord = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const result = await CrudService.createRecord(table, data);
      handleSuccess('Create', result);
      return result;
    } catch (err) {
      handleError('Create', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [table, handleSuccess, handleError]);

  const updateRecord = useCallback(async (id: string, updates: any) => {
    setLoading(true);
    try {
      const result = await CrudService.updateRecord(table, id, updates);
      handleSuccess('Update', result);
      return result;
    } catch (err) {
      handleError('Update', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [table, handleSuccess, handleError]);

  const deleteRecord = useCallback(async (id: string, hardDelete: boolean = false) => {
    setLoading(true);
    try {
      await CrudService.deleteRecord(table, id, hardDelete);
      handleSuccess('Delete');
      return true;
    } catch (err) {
      handleError('Delete', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [table, handleSuccess, handleError]);

  const exportRecords = useCallback(async (exportOptions?: Partial<ExportOptions>) => {
    setLoading(true);
    try {
      const options: ExportOptions = {
        table,
        select: defaultSelect || '*',
        orderBy: defaultOrderBy,
        ...exportOptions,
      };
      
      await CrudService.exportRecords(options);
      handleSuccess('Export');
    } catch (err) {
      handleError('Export', err);
    } finally {
      setLoading(false);
    }
  }, [table, defaultSelect, defaultOrderBy, handleSuccess, handleError]);

  const importRecords = useCallback(async (importOptions: Omit<ImportOptions, 'table'>) => {
    setLoading(true);
    try {
      const options: ImportOptions = {
        table,
        ...importOptions,
      };
      
      const result = await CrudService.importRecords(options);
      handleSuccess('Import', result);
      return result;
    } catch (err) {
      handleError('Import', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [table, handleSuccess, handleError]);

  return {
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    exportRecords,
    importRecords,
  };
};

export default useCrud;
