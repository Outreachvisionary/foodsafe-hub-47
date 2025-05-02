
import { createClient } from '@supabase/supabase-js';

// Environment variables should be properly set in the project
const supabaseUrl = 'https://vngmjjvfofoggfqgpizo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZ21qanZmb2ZvZ2dmcWdwaXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Nzk1NjYsImV4cCI6MjA1ODQ1NTU2Nn0.hKuiNWB9g90lklzXollw-O7-8kHCl33wKYmC5EW_sLI';

// Hardcoded values are used instead of empty strings to ensure the client is properly initialized
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
