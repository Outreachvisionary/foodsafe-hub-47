import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NonConformance } from '@/types/non-conformance';

export const useNonConformance = (id: string) => {
  return useQuery({
    queryKey: ['non-conformance', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NonConformance;
    },
    enabled: !!id,
  });
};