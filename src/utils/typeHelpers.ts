
/**
 * Helper function to safely access properties that might not exist
 * @param obj The object to access properties from
 * @param property The property to access
 * @param defaultValue The default value to return if property doesn't exist
 * @returns The property value or default value
 */
export function safeGet<T, K extends keyof T>(
  obj: T | undefined | null, 
  property: K, 
  defaultValue: T[K]
): T[K] {
  if (!obj) return defaultValue;
  return obj[property] !== undefined ? obj[property] : defaultValue;
}
