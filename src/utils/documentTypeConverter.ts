
import { Document as SupabaseDocument, Folder as SupabaseFolder, DocumentCategory, DocumentActivity, DocumentVersion, DocumentNotification } from "@/types/supabase";
import { Document as AppDocument, Folder as AppFolder, DocumentCategory as AppDocumentCategory, DocumentAction, DocumentActivity as AppDocumentActivity, DocumentVersion as AppDocumentVersion } from "@/types/document";

/**
 * Converts a Supabase document to an application document
 */
export const supabaseToAppDocument = (doc: SupabaseDocument): AppDocument => {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    fileName: doc.file_name,
    fileSize: doc.file_size,
    fileType: doc.file_type,
    category: doc.category_id ? "Other" : "Other", // We'll need to look up the actual category name
    status: doc.status as any, // The enum values are the same
    version: doc.version,
    createdBy: doc.created_by,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    expiryDate: doc.expiry_date,
    linkedModule: doc.linked_module as any,
    linkedItemId: doc.linked_item_id,
    tags: doc.tags || [],
    approvers: doc.approvers || [],
    pendingSince: doc.pending_since,
    lastAction: doc.last_action as any,
    isLocked: doc.is_locked || false,
    lastReviewDate: doc.last_review_date,
    nextReviewDate: doc.next_review_date,
    rejectionReason: doc.rejection_reason,
  };
};

/**
 * Converts an application document to a Supabase document
 */
export const appToSupabaseDocument = (doc: AppDocument): Partial<SupabaseDocument> => {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    file_name: doc.fileName,
    file_size: doc.fileSize,
    file_type: doc.fileType,
    category_id: undefined, // We'd need a lookup for this
    status: doc.status as any,
    version: doc.version,
    created_by: doc.createdBy,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    expiry_date: doc.expiryDate,
    linked_module: doc.linkedModule,
    linked_item_id: doc.linkedItemId,
    tags: doc.tags,
    approvers: doc.approvers,
    pending_since: doc.pendingSince,
    last_action: doc.lastAction,
    is_locked: doc.isLocked,
    last_review_date: doc.lastReviewDate,
    next_review_date: doc.nextReviewDate,
    rejection_reason: doc.rejectionReason,
  };
};

/**
 * Converts a Supabase folder to an application folder
 */
export const supabaseToAppFolder = (folder: SupabaseFolder): AppFolder => {
  return {
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id,
    path: folder.path,
    createdBy: folder.created_by,
    createdAt: folder.created_at,
    updatedAt: folder.updated_at,
    documentCount: folder.document_count,
  };
};

/**
 * Converts an application folder to a Supabase folder
 */
export const appToSupabaseFolder = (folder: AppFolder): Partial<SupabaseFolder> => {
  return {
    id: folder.id,
    name: folder.name,
    parent_id: folder.parentId,
    path: folder.path,
    created_by: folder.createdBy,
    created_at: folder.createdAt,
    updated_at: folder.updatedAt,
    document_count: folder.documentCount,
  };
};

/**
 * Converts a Supabase document activity to an application document activity
 */
export const supabaseToAppDocumentActivity = (activity: DocumentActivity): AppDocumentActivity => {
  return {
    id: activity.id,
    documentId: activity.document_id || "",
    action: activity.action as DocumentAction,
    timestamp: activity.timestamp,
    userId: activity.user_id,
    userName: activity.user_name,
    userRole: activity.user_role,
    comments: activity.comments,
  };
};

/**
 * Converts an application document activity to a Supabase document activity
 */
export const appToSupabaseDocumentActivity = (activity: AppDocumentActivity): Partial<DocumentActivity> => {
  return {
    id: activity.id,
    document_id: activity.documentId,
    action: activity.action,
    timestamp: activity.timestamp,
    user_id: activity.userId,
    user_name: activity.userName,
    user_role: activity.userRole,
    comments: activity.comments,
  };
};

/**
 * Converts a Supabase document version to an application document version
 */
export const supabaseToAppDocumentVersion = (version: DocumentVersion): AppDocumentVersion => {
  return {
    id: version.id,
    documentId: version.document_id || "",
    version: version.version,
    fileName: version.file_name,
    fileSize: version.file_size,
    createdBy: version.created_by,
    createdAt: version.created_at,
    changeNotes: version.change_notes,
  };
};

/**
 * Converts an application document version to a Supabase document version
 */
export const appToSupabaseDocumentVersion = (version: AppDocumentVersion): Partial<DocumentVersion> => {
  return {
    id: version.id,
    document_id: version.documentId,
    version: version.version,
    file_name: version.fileName,
    file_size: version.fileSize,
    created_by: version.createdBy,
    created_at: version.createdAt,
    change_notes: version.changeNotes,
  };
};
