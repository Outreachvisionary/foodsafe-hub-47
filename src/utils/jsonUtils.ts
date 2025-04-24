
/**
 * Safely converts a JSON value to a Record<string, any> type
 * This is useful when dealing with JSON data from the database 
 * that needs to be used in TypeScript with strict typing
 */
export function ensureRecord(jsonValue: any): Record<string, any> {
  if (jsonValue === null || jsonValue === undefined) {
    return {};
  }
  
  if (typeof jsonValue === 'object' && !Array.isArray(jsonValue)) {
    return jsonValue as Record<string, any>;
  }
  
  // If it's not an object, wrap it in an object
  return { value: jsonValue };
}

/**
 * Safely parse a JSON string or return a default object
 */
export function safeJsonParse(jsonString: string | null | undefined): Record<string, any> {
  if (!jsonString) return {};
  
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return {};
  }
}

export default {
  ensureRecord,
  safeJsonParse
};
