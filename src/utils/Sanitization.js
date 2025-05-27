class Sanitization {
  // Trim and remove extra spaces from a string
  static trimString(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/\s+/g, ' ');
  }

  // Validate and sanitize a positive number
  static sanitizeNumber(input) {
    const num = Number(input);
    if (isNaN(num) || num <= 0) return null;
    return num;
  }

  // Sanitize search query (lowercase, trim, remove extra spaces)
  static sanitizeSearchQuery(input) {
    if (typeof input !== 'string') return '';
    return this.trimString(input).toLowerCase();
  }

  // Validate non-empty string
  static isNonEmptyString(input) {
    return typeof input === 'string' && this.trimString(input).length > 0;
  }
}

export default Sanitization;