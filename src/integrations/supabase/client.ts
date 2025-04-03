
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

// Create the Supabase client with proper URL and key fallbacks
export const supabase = createClient<Database>(
  supabaseUrl || `https://vngmjjvfofoggfqgpizo.supabase.co`,
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ21qanZmb2ZvZ2dmcWdwaXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Nzk1NjYsImV4cCI6MjA1ODQ1NTU2Nn0.hKuiNWB9g90lklzXollw-O7-8kHCl33wKYmC5EW_sLI'
);

// Test the connection on startup
supabase.from('organizations').select('count(*)', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Failed to connect to Supabase:', error.message);
    } else {
      console.info('Successfully connected to Supabase');
    }
  });
