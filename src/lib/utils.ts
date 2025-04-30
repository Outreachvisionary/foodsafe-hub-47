
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateDocumentId(): string {
  return 'DOC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function formatDatetime(datetime: string | Date): string {
  if (!datetime) return 'N/A';
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getFilenameFromPath(path: string): string {
  if (!path) return '';
  return path.split('/').pop() || path;
}

export function getFileExtension(filename: string): string {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
}

export function isPdfFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf';
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'pdf': return 'file-pdf';
    case 'doc':
    case 'docx': return 'file-text';
    case 'xls':
    case 'xlsx': return 'file-spreadsheet';
    case 'ppt':
    case 'pptx': return 'file-presentation';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return 'file-image';
    default: return 'file';
  }
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'Draft': 'bg-gray-200 text-gray-800',
    'In_Review': 'bg-blue-100 text-blue-800',
    'Pending_Review': 'bg-blue-100 text-blue-800',
    'Pending_Approval': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Published': 'bg-green-100 text-green-800',
    'Archived': 'bg-purple-100 text-purple-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Obsolete': 'bg-gray-100 text-gray-800',
    'Active': 'bg-emerald-100 text-emerald-800',
    'Expired': 'bg-red-100 text-red-800'
  };
  
  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
