
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size to human-readable string
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if necessary
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Generates initials from a name (e.g., "John Doe" -> "JD")
 * @param name Full name
 * @param maxInitials Maximum number of initials to return
 * @returns String of initials
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, maxInitials)
    .map(part => part[0].toUpperCase())
    .join('');
}

/**
 * Converts a date string to a localized formatted date
 * @param dateString Date string
 * @param includeTime Whether to include time in the formatted date
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined, includeTime: boolean = false): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Verify the date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
