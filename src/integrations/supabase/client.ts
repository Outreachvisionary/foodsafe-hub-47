
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are not set properly:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Not set');
  
  // Use the Supabase project ID from the error message as a fallback
  const projectId = 'vngmjjvfofoggfqgpizo';
  
  console.info('Using fallback Supabase configuration');
  console.info(`URL: https://${projectId}.supabase.co`);
}

// Fallback values if environment variables are not available
const fallbackUrl = `https://vngmjjvfofoggfqgpizo.supabase.co`;
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ21qanZmb2ZvZ2dmcWdwaXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Nzk1NjYsImV4cCI6MjA1ODQ1NTU2Nn0.hKuiNWB9g90lklzXollw-O7-8kHCl33wKYmC5EW_sLI';

// Create the Supabase client with proper URL and key fallbacks
export const supabase = createClient<Database>(
  supabaseUrl || fallbackUrl,
  supabaseKey || fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (...args: Parameters<typeof fetch>) => {
        // Use a custom fetch with timeout to prevent hanging requests
        const controller = new AbortController();
        const { signal } = controller;
        
        // Set a 30-second timeout for all Supabase requests
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        // Add the signal to the fetch options
        args[1] = { ...args[1], signal };
        
        return fetch(...args)
          .then(response => {
            clearTimeout(timeoutId);
            return response;
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Supabase fetch error:', error);
            throw error;
          });
      }
    }
  }
);

// Export config information that can be used for display purposes
export const supabaseConfig = {
  url: supabaseUrl || fallbackUrl,
  keyPreview: supabaseKey ? `***${supabaseKey.slice(-6)}` : '***[fallback key]',
  isUsingFallback: !supabaseUrl || !supabaseKey
};

// Check connection status function that can be called on demand
export async function checkSupabaseConnection() {
  try {
    console.info('Testing Supabase connection...');
    const startTime = Date.now();
    
    const { data, error, status } = await supabase
      .from('organizations')
      .select('count(*)', { count: 'exact', head: true });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (error) {
      console.error(`Failed to connect to Supabase: ${error.message} (${responseTime}ms)`);
      return {
        success: false,
        error: error.message,
        responseTime,
        status
      };
    }
    
    console.info(`Successfully connected to Supabase (${responseTime}ms)`);
    return {
      success: true,
      responseTime,
      status
    };
  } catch (error: any) {
    console.error('Exception checking Supabase connection:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      responseTime: 0
    };
  }
}

// Initialize connection (optional, will connect on first request anyway)
checkSupabaseConnection()
  .then(result => {
    if (!result.success) {
      console.warn('Initial Supabase connection check failed. Will retry on actual requests.');
    }
  });
