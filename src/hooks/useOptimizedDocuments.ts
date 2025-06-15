
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';

export const useOptimizedDocuments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['optimized-documents'],
    queryFn: async (): Promise<Document[]> => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        throw new Error(error.message);
      }
      
      return data as Document[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
  });
};
