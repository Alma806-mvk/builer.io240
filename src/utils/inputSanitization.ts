/**
 * Utility functions to sanitize user input and prevent instruction injection
 */

/**
 * Sanitizes user input by removing any text that might be interpreted as generation instructions
 * @param input - The raw user input
 * @returns Sanitized input with instruction-like text removed
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input || typeof input !== "string") {
    return input;
  }

  // Patterns that might be interpreted as generation instructions
  const instructionPatterns = [
    /number of concepts to generate:?\s*\d+/gi,
    /generate\s+\d+\s+(concepts?|ideas?|variations?)/gi,
    /create\s+\d+\s+(concepts?|ideas?|variations?)/gi,
    /make\s+\d+\s+(concepts?|ideas?|variations?)/gi,
    /\d+\s+(concepts?|ideas?|variations?)\s*(please|to generate)?/gi,
    /batch\s*size:?\s*\d+/gi,
    /count:?\s*\d+/gi,
    /quantity:?\s*\d+/gi,
  ];

  let sanitized = input;

  // Remove instruction-like patterns
  instructionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "").trim();
  });

  // Clean up extra whitespace and commas
  sanitized = sanitized
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .replace(/,\s*,/g, ",") // Multiple commas to single comma
    .replace(/^\s*,\s*/, "") // Leading comma
    .replace(/\s*,\s*$/, "") // Trailing comma
    .trim();

  return sanitized;
};

/**
 * Logs what was removed for debugging purposes
 * @param original - Original input
 * @param sanitized - Sanitized input
 */
export const logSanitization = (original: string, sanitized: string): void => {
  if (original !== sanitized) {
    console.info("🧹 Input sanitized:", {
      original:
        original.substring(0, 100) + (original.length > 100 ? "..." : ""),
      sanitized:
        sanitized.substring(0, 100) + (sanitized.length > 100 ? "..." : ""),
      removedInstructions: true,
    });
  }
};

/**
 * Validates that the input doesn't contain generation instructions after sanitization
 * @param input - Input to validate
 * @returns True if input is clean, false if it still contains instructions
 */
export const validateSanitizedInput = (input: string): boolean => {
  const instructionKeywords = [
    "number of concepts",
    "generate ",
    "create ",
    "make ",
    "batch size",
    "count:",
    "quantity:",
  ];

  const lowerInput = input.toLowerCase();
  return !instructionKeywords.some(
    (keyword) => lowerInput.includes(keyword) && /\d/.test(lowerInput),
  );
};
