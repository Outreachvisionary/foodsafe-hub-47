
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Types for reference data
export interface DocumentStatusType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DocumentCategoryType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DocumentPermissionType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useDocumentStatuses() {
  const [statuses, setStatuses] = useState<DocumentStatusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('document_status_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) {
          throw error;
        }

        setStatuses(data as DocumentStatusType[]);
      } catch (err) {
        console.error('Error fetching document statuses:', err);
        setError(err as Error);
        toast({
          title: 'Error fetching document statuses',
          description: (err as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [toast]);

  return { statuses, loading, error };
}

export function useDocumentCategories() {
  const [categories, setCategories] = useState<DocumentCategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('document_category_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) {
          throw error;
        }

        setCategories(data as DocumentCategoryType[]);
      } catch (err) {
        console.error('Error fetching document categories:', err);
        setError(err as Error);
        toast({
          title: 'Error fetching document categories',
          description: (err as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  return { categories, loading, error };
}

export function useDocumentPermissions() {
  const [permissions, setPermissions] = useState<DocumentPermissionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('document_permission_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) {
          throw error;
        }

        setPermissions(data as DocumentPermissionType[]);
      } catch (err) {
        console.error('Error fetching document permissions:', err);
        setError(err as Error);
        toast({
          title: 'Error fetching document permissions',
          description: (err as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [toast]);

  return { permissions, loading, error };
}
