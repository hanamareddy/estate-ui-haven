
/**
 * Validation utility functions for form validation
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Phone number validation (supports international formats)
export const isValidPhone = (phone: string): boolean => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

// Password strength validation
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Price validation (number and greater than zero)
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && price > 0;
};

// Text field validation with min/max length
export const isValidText = (text: string, minLength = 1, maxLength = 1000): boolean => {
  return text.length >= minLength && text.length <= maxLength;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate property form
export const validatePropertyForm = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Required fields
  if (!formData.title || formData.title.trim() === '') 
    errors.title = 'Title is required';
  else if (formData.title.length < 5) 
    errors.title = 'Title must be at least 5 characters';
  
  if (!formData.address || formData.address.trim() === '') 
    errors.address = 'Address is required';
  
  if (!formData.price || formData.price <= 0)
    errors.price = 'Price must be greater than zero';
  
  if (!formData.type || formData.type.trim() === '')
    errors.type = 'Property type is required';
  
  // Optional fields validation
  if (formData.bedrooms !== undefined && formData.bedrooms < 0)
    errors.bedrooms = 'Bedrooms cannot be negative';
  
  if (formData.bathrooms !== undefined && formData.bathrooms < 0)
    errors.bathrooms = 'Bathrooms cannot be negative';
  
  if (formData.sqft !== undefined && formData.sqft <= 0)
    errors.sqft = 'Square footage must be greater than zero';
  
  if (formData.description && formData.description.length < 20)
    errors.description = 'Description should be at least 20 characters';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user profile form
export const validateUserForm = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!formData.name || formData.name.trim() === '')
    errors.name = 'Name is required';
  
  if (!formData.email || !isValidEmail(formData.email))
    errors.email = 'Valid email is required';
  
  if (formData.phone && !isValidPhone(formData.phone))
    errors.phone = 'Invalid phone number format';
  
  if (formData.password && !isStrongPassword(formData.password))
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  
  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
