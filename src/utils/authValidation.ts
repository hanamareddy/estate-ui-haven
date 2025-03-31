
/**
 * Validates email format
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates an Indian phone number
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export const isValidIndianPhone = (phone: string): boolean => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits, or with country code)
  if (cleanPhone.length === 10) {
    // Standard 10-digit Indian mobile number
    return /^[6-9]\d{9}$/.test(cleanPhone);
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    // With 91 country code
    return /^91[6-9]\d{9}$/.test(cleanPhone);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    // With leading 0
    return /^0[6-9]\d{9}$/.test(cleanPhone);
  }
  
  return false;
};

/**
 * Formats an Indian phone number to standard format with country code
 * @param phone Phone number to format
 * @returns Formatted phone number
 */
export const formatIndianPhone = (phone: string): string => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Extract last 10 digits (in case there's a country code)
  const last10Digits = cleanPhone.slice(-10);
  
  // Check if it already has country code
  if (cleanPhone.length > 10) {
    if (cleanPhone.startsWith('91')) {
      return `+91${last10Digits}`;
    }
    if (cleanPhone.startsWith('0')) {
      return `+91${cleanPhone.substring(1)}`;
    }
  }
  
  // Add +91 to 10-digit numbers
  return `+91${last10Digits}`;
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object with isValid flag and message
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validates RERA ID format (for real estate agents in India)
 * @param reraId RERA ID to validate
 * @returns Boolean indicating if RERA ID is valid
 */
export const isValidReraId = (reraId: string): boolean => {
  // RERA IDs typically follow patterns like:
  // Maharashtra: A51800000001
  // Karnataka: PRM/KA/RERA/1251/310/AG/171013/000001
  // Delhi: DLRERA2023000001
  // We'll do a basic check for now
  return reraId.length >= 8 && /^[A-Z0-9/]+$/i.test(reraId);
};
