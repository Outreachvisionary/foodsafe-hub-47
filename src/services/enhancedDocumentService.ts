
import { supabase } from '@/integrations/supabase/client';
import { DocumentAccess } from '@/types/document';

// Fetch document access permissions
export async function fetchDocumentAccess(documentId: string): Promise<DocumentAccess[]> {
  try {
    const { data, error } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId);
      
    if (error) throw error;
    
    return data as DocumentAccess[];
  } catch (error) {
    console.error('Error fetching document access permissions:', error);
    throw error;
  }
}

// Grant access to a document
export async function grantDocumentAccess(
  documentId: string,
  userId: string,
  permissionLevel: string,
  grantedBy: string
): Promise<DocumentAccess> {
  try {
    // Check if access record already exists
    const { data: existingAccess } = await supabase
      .from('document_access')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (existingAccess) {
      // Update existing access
      const { data, error } = await supabase
        .from('document_access')
        .update({
          permission_level: permissionLevel,
          granted_by: grantedBy,
          granted_at: new Date().toISOString()
        })
        .eq('id', existingAccess.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as DocumentAccess;
    } else {
      // Create new access record
      const { data, error } = await supabase
        .from('document_access')
        .insert({
          document_id: documentId,
          user_id: userId,
          permission_level: permissionLevel,
          granted_by: grantedBy
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as DocumentAccess;
    }
  } catch (error) {
    console.error('Error granting document access:', error);
    throw error;
  }
}

// Revoke access to a document
export async function revokeDocumentAccess(accessId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_access')
      .delete()
      .eq('id', accessId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error revoking document access:', error);
    throw error;
  }
}

// Advanced document validation
export async function validateDocumentMetadata(documentId: string): Promise<{
  valid: boolean;
  issues: string[];
}> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
      
    if (error) throw error;
    
    const issues: string[] = [];
    
    // Check for required metadata
    if (!data.title || data.title.trim() === '') {
      issues.push('Document title is missing');
    }
    
    if (!data.category || data.category.trim() === '') {
      issues.push('Document category is not specified');
    }
    
    // Check for document expiry
    if (data.expiry_date) {
      const expiryDate = new Date(data.expiry_date);
      const now = new Date();
      
      if (expiryDate < now) {
        issues.push('Document has expired');
      } else {
        // Check if document is about to expire (within 30 days)
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 30) {
          issues.push(`Document will expire in ${daysUntilExpiry} days`);
        }
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  } catch (error) {
    console.error('Error validating document metadata:', error);
    throw error;
  }
}

// Track document views
export async function trackDocumentView(documentId: string, userId: string): Promise<void> {
  try {
    // Record view activity
    await supabase
      .from('document_activities')
      .insert({
        document_id: documentId,
        user_id: userId,
        user_name: 'Current User', // Replace with actual user name in a real app
        user_role: 'Viewer', // Replace with actual user role
        action: 'view'
      });
  } catch (error) {
    console.error('Error tracking document view:', error);
    // Don't throw - this is a non-critical operation
  }
}

// Get document statistics
export async function getDocumentStatistics(): Promise<Record<string, any>> {
  try {
    // Get count by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('documents')
      .select('status, count(*)')
      .group('status');
      
    if (statusError) throw statusError;
    
    // Get count by category
    const { data: categoryCounts, error: categoryError } = await supabase
      .from('documents')
      .select('category, count(*)')
      .group('category');
      
    if (categoryError) throw categoryError;
    
    // Get recently updated documents
    const { data: recentUpdates, error: recentError } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5);
      
    if (recentError) throw recentError;
    
    // Return combined statistics
    return {
      byStatus: statusCounts.reduce((acc: Record<string, number>, item: any) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      
      byCategory: categoryCounts.reduce((acc: Record<string, number>, item: any) => {
        acc[item.category] = parseInt(item.count);
        return acc;
      }, {}),
      
      recentlyUpdated: recentUpdates,
      totalCount: statusCounts.reduce((sum: number, item: any) => sum + parseInt(item.count), 0)
    };
  } catch (error) {
    console.error('Error getting document statistics:', error);
    throw error;
  }
}
