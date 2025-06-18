
import { supabase } from '@/integrations/supabase/client';

export const debugSupabaseConnection = async () => {
  console.group('🔍 Supabase Debug Information');
  
  try {
    // Check basic connection
    console.log('📡 Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('organizations')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError);
    } else {
      console.log('✅ Basic connection successful');
    }

    // Check auth status
    console.log('🔐 Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth check failed:', authError);
    } else if (user) {
      console.log('✅ User authenticated:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      });
    } else {
      console.warn('⚠️ No authenticated user');
    }

    // Check session
    console.log('🎫 Checking session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError);
    } else if (session) {
      console.log('✅ Active session found:', {
        expires_at: session.expires_at,
        token_type: session.token_type
      });
    } else {
      console.warn('⚠️ No active session');
    }

    // Test table access
    console.log('🗃️ Testing table access...');
    const tables = ['complaints', 'documents', 'non_conformances', 'profiles'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.error(`❌ ${table} access failed:`, error.message);
        } else {
          console.log(`✅ ${table} accessible`);
        }
      } catch (err) {
        console.error(`❌ ${table} test error:`, err);
      }
    }

  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
  
  console.groupEnd();
};

export const debugEnvironment = () => {
  console.group('🌍 Environment Debug Information');
  
  console.log('🔗 Supabase URL:', 'https://vngmjjvfofoggfqgpizo.supabase.co');
  console.log('🔑 Anon Key (partial):', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('🌐 Current URL:', window.location.href);
  console.log('📱 User Agent:', navigator.userAgent);
  console.log('🕐 Current Time:', new Date().toISOString());
  
  // Check localStorage
  console.log('💾 LocalStorage keys:', Object.keys(localStorage));
  
  // Check network status
  console.log('📶 Online Status:', navigator.onLine);
  
  console.groupEnd();
};

export const runFullDiagnostics = async () => {
  console.clear();
  console.log('🚀 Starting Full System Diagnostics...');
  
  debugEnvironment();
  await debugSupabaseConnection();
  
  console.log('✨ Diagnostics complete!');
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).runDiagnostics = runFullDiagnostics;
  (window as any).debugSupabase = debugSupabaseConnection;
  (window as any).debugEnv = debugEnvironment;
}
