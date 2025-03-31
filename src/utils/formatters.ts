
/**
 * Format currency values in Indian Rupee format
 * @param value Number to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'decimal',
  });
};

/**
 * Format date in Indian format (DD/MM/YYYY)
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format area in square feet with proper suffix
 * @param area Area in square feet
 * @returns Formatted area string
 */
export const formatArea = (area: number): string => {
  return `${area.toLocaleString('en-IN')} sq.ft.`;
};
