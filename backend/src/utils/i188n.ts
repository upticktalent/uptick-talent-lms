import { i18n } from '../constants/i18n';

/**
 * Helper function to get localized messages with parameter replacement
 * @param key - The message key (e.g., 'ADMIN.ERRORS.EMAIL_REQUIRED')
 * @param params - Optional parameters to replace in the message
 * @returns The localized message string
 */
export const getMessage = (key: string, params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = i18n.en;
  
  // Traverse the nested object structure
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Message key not found: ${key}`);
      return key; // Fallback to key if not found
    }
  }
  
  // Replace parameters in the message if it's a string
  if (params && typeof value === 'string') {
    return value.replace(/{(\w+)}/g, (match, param) => {
      return params[param] !== undefined ? String(params[param]) : match;
    });
  }
  
  return value || key;
};

/**
 * Alternative function that supports multiple languages
 * @param key - The message key
 * @param params - Optional parameters to replace
 * @param lang - Language code (default: 'en')
 * @returns The localized message string
 */
export const getMessageWithLang = (key: string, params?: Record<string, any>, lang: string = 'en'): string => {
  const keys = key.split('.');
  let value: any = i18n[lang as keyof typeof i18n];
  
  if (!value) {
    console.warn(`Language not found: ${lang}, falling back to English`);
    value = i18n.en;
  }
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Message key not found: ${key} for language: ${lang}`);
      return key;
    }
  }
  
  if (params && typeof value === 'string') {
    return value.replace(/{(\w+)}/g, (match, param) => {
      return params[param] !== undefined ? String(params[param]) : match;
    });
  }
  
  return value || key;
};

/**
 * Check if a message key exists in the i18n structure
 * @param key - The message key to check
 * @returns boolean indicating if the key exists
 */
export const hasMessage = (key: string): boolean => {
  const keys = key.split('.');
  let value: any = i18n.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return false;
  }
  
  return true;
};