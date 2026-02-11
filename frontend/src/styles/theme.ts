// Color palette from https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
export const colors = {
  primary: {
    darkest: '#001219',    // Very Dark Blue
    dark: '#005F73',       // Dark Teal
    medium: '#0A9396',     // Teal
    light: '#94D2BD',      // Light Teal
    lightest: '#E9D8A6',   // Light Beige/Yellow
  },
  accent: {
    yellow: '#EE9B00',     // Orange/Yellow
    orange: '#CA6702',     // Dark Orange
    redOrange: '#BB3E03',  // Red Orange
    darkRed: '#AE2012',    // Dark Red
    darkestRed: '#9B2226', // Very Dark Red
  },
  // Semantic colors mapped from palette
  background: {
    primary: '#E9D8A6',    // Light Beige
    secondary: '#94D2BD',  // Light Teal
    dark: '#005F73',       // Dark Teal
  },
  text: {
    primary: '#001219',    // Very Dark Blue
    secondary: '#005F73',  // Dark Teal
    light: '#94D2BD',      // Light Teal for disabled/placeholder
    white: '#ffffff',
  },
  button: {
    primary: '#0A9396',    // Teal
    primaryHover: '#005F73', // Dark Teal
    secondary: '#94D2BD',  // Light Teal
    secondaryHover: '#0A9396', // Teal
    danger: '#BB3E03',     // Red Orange
    dangerHover: '#AE2012', // Dark Red
    warning: '#EE9B00',    // Orange/Yellow
    warningHover: '#CA6702', // Dark Orange
  },
  status: {
    success: '#0A9396',    // Teal
    warning: '#EE9B00',    // Orange/Yellow
    error: '#BB3E03',      // Red Orange
    info: '#94D2BD',       // Light Teal
  },
  border: {
    light: '#94D2BD',      // Light Teal
    medium: '#0A9396',     // Teal
    dark: '#005F73',       // Dark Teal
  },
} as const;

export const typography = {
  fontFamily: {
    primary: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    heading: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    mono: "'Fira Code', 'Monaco', 'Consolas', monospace",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '2.5rem',  // 40px
  '4xl': '3rem',    // 48px
  '5xl': '4rem',    // 64px
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(0, 18, 25, 0.12), 0 1px 2px rgba(0, 18, 25, 0.24)',
  md: '0 4px 6px rgba(0, 18, 25, 0.12), 0 2px 4px rgba(0, 18, 25, 0.08)',
  lg: '0 10px 15px rgba(0, 18, 25, 0.12), 0 4px 6px rgba(0, 18, 25, 0.08)',
  xl: '0 20px 25px rgba(0, 18, 25, 0.15), 0 10px 10px rgba(0, 18, 25, 0.04)',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;