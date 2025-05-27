export const COLORS = {
  // Primary palette
  primary: '#2563EB',       // Vibrant blue (better contrast)
  primaryDark: '#1E40AF',   // Deep blue
  primaryLight: '#93C5FD',  // Soft blue
  primaryLighter: '#EFF6FF', // Very light blue for backgrounds
  
  // Text palette
  text: '#1F2937',          // Dark gray (better readability)
  textLight: '#4B5563',     // Medium gray
  textLighter: '#9CA3AF',   // Light gray
  
  // Backgrounds
  background: '#F9FAFB',    // Very light gray
  card: '#FFFFFF',          // White
  
  // Accents
  error: '#DC2626',         // Rich red
  success: '#059669',       // Deep green
  warning: '#D97706',       // Amber
  info: '#2563EB',          // Matching primary
  
  // Finance-specific
  income: '#2563EB',        // Blue (matches primary)
  expense: '#DC2626',       // Red (matches error)
  budget: '#059669',        // Green (matches success)
  overbudget: '#DC2626',    // Red (matches error)
  
  // Gradients
  gradientStart: '#2563EB',
  gradientEnd: '#1E40AF',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  // Consider adding these custom fonts:
  // regular: 'Inter-Regular',
  // medium: 'Inter-Medium',
  // bold: 'Inter-Bold',
  // semiBold: 'Inter-SemiBold',
};

export const SIZES = {
  base: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const SHADOWS = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BORDERS = {
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
  width: {
    thin: 0.5,
    light: 1,
    normal: 1.5,
    thick: 2,
  },
};