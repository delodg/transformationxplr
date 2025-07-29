// Date utilities for the Transformation XPLR platform
// Uses current system date to generate appropriate dates for 2025

/**
 * Get the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get a date that's a specific number of months from now
 */
export const getDateInMonths = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

/**
 * Get the end of the current year
 */
export const getEndOfYear = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-12-31`;
};

/**
 * Get a typical project completion date (6-12 months from now)
 */
export const getEstimatedProjectCompletion = (): string => {
  // For a typical transformation project, estimate 8 months completion
  return getDateInMonths(8);
};

/**
 * Get the current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Format a date for display
 */
export const formatDateForDisplay = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Pre-computed values for common use cases
export const CURRENT_DATE = getCurrentDate();
export const END_OF_YEAR = getEndOfYear(); 
export const PROJECT_COMPLETION_DATE = getEstimatedProjectCompletion();
export const CURRENT_YEAR = getCurrentYear();