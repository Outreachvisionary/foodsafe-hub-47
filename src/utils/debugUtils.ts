
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

    // Test table access with explicit table names
    console.log('🗃️ Testing table access...');
    
    // Test complaints table
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ complaints access failed:', error.message);
      } else {
        console.log('✅ complaints accessible');
      }
    } catch (err) {
      console.error('❌ complaints test error:', err);
    }

    // Test documents table
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ documents access failed:', error.message);
      } else {
        console.log('✅ documents accessible');
      }
    } catch (err) {
      console.error('❌ documents test error:', err);
    }

    // Test non_conformances table
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ non_conformances access failed:', error.message);
      } else {
        console.log('✅ non_conformances accessible');
      }
    } catch (err) {
      console.error('❌ non_conformances test error:', err);
    }

    // Test capa_actions table
    try {
      const { data, error } = await supabase
        .from('capa_actions')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ capa_actions access failed:', error.message);
      } else {
        console.log('✅ capa_actions accessible');
      }
    } catch (err) {
      console.error('❌ capa_actions test error:', err);
    }

    // Test profiles table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ profiles access failed:', error.message);
      } else {
        console.log('✅ profiles accessible');
      }
    } catch (err) {
      console.error('❌ profiles test error:', err);
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
