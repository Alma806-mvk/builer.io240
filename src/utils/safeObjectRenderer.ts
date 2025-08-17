/**
 * Utility functions to safely render objects and prevent React "Objects are not valid as a React child" errors
 */

// Known problematic object property patterns
const PROBLEMATIC_OBJECT_PATTERNS = [
  // Service categories (camelCase)
  'videoProduction', 'graphicsAndDesign', 'seoAndAnalytics', 'schedulingAndManagement',
  'communicationAndCollaboration', 'liveStreaming', 'emailMarketing',
  
  // Service categories (space-separated)
  'Video Production', 'Graphic Design & Thumbnails', 'SEO & Analytics', 
  'Content Management & Scheduling', 'Community', 'Monetization/Sales',
  
  // Strategy planning objects
  'revenueStreams', 'growthPhases', 'advancedMetrics', 'contentPillars',
  'scalabilityPlanning', 'monetizationStrategy', 'analyticsAndKPIs'
];

/**
 * Detects if an object contains properties that commonly cause React rendering errors
 */
export const isProblematicObject = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);
  return keys.some(key => 
    PROBLEMATIC_OBJECT_PATTERNS.some(pattern => 
      key === pattern || key.toLowerCase().includes(pattern.toLowerCase())
    )
  );
};

/**
 * Safely converts an object to a displayable string format
 */
export const safeObjectToString = (value: any): string => {
  try {
    if (value === null || value === undefined) {
      return 'Not specified';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => 
        typeof item === 'string' ? item : String(item)
      ).join(', ');
    }

    if (typeof value === 'object') {
      // Handle service categorization objects
      if (isProblematicObject(value)) {
        return Object.entries(value)
          .map(([key, val]) => {
            const displayKey = key.includes(' ') || key.includes('&') || key.includes('/') 
              ? key 
              : key.replace(/([A-Z])/g, ' $1').trim();
            
            if (Array.isArray(val)) {
              return `${displayKey}: ${val.join(', ')}`;
            } else if (typeof val === 'object' && val !== null) {
              return `${displayKey}: ${JSON.stringify(val)}`;
            } else {
              return `${displayKey}: ${String(val)}`;
            }
          })
          .join('\n');
      }

      // Handle regular objects
      return Object.entries(value)
        .map(([k, v]) => {
          const safeKey = String(k);
          let safeValue;
          if (typeof v === 'object' && v !== null) {
            safeValue = JSON.stringify(v);
          } else {
            safeValue = String(v);
          }
          return `${safeKey}: ${safeValue}`;
        })
        .join(', ');
    }

    return String(value);
  } catch (error) {
    console.warn('Error in safeObjectToString:', error, 'Value:', value);
    return 'Display error';
  }
};

/**
 * React-safe wrapper for rendering any value
 */
export const renderSafeValue = (value: any): string => {
  // Always return a string to ensure React compatibility
  return safeObjectToString(value);
};

/**
 * Debug function to log problematic objects
 */
export const debugProblematicObject = (value: any, context?: string): void => {
  if (import.meta.env.DEV && isProblematicObject(value)) {
    console.warn('🔧 Problematic object detected:', {
      context,
      objectKeys: Object.keys(value),
      value,
      suggestion: 'Use safeObjectToString() or renderSafeValue() to safely render this object'
    });
  }
};
