import { createTheme } from '@mui/material/styles';
import { colors, typography, shadows } from './theme';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      colors: typeof colors;
    };
  }

  interface ThemeOptions {
    custom?: {
      colors?: typeof colors;
    };
  }
}

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary.medium,      // #0A9396 - Teal
      dark: colors.primary.dark,        // #005F73 - Dark Teal
      light: colors.primary.light,      // #94D2BD - Light Teal
      contrastText: colors.text.white,
    },
    secondary: {
      main: colors.accent.yellow,       // #EE9B00 - Orange/Yellow
      dark: colors.accent.orange,       // #CA6702 - Dark Orange
      light: colors.primary.lightest,   // #E9D8A6 - Light Beige
      contrastText: colors.text.primary,
    },
    error: {
      main: colors.accent.redOrange,    // #BB3E03 - Red Orange
      dark: colors.accent.darkRed,      // #AE2012 - Dark Red
      light: colors.accent.redOrange,
      contrastText: colors.text.white,
    },
    warning: {
      main: colors.accent.yellow,       // #EE9B00 - Orange/Yellow
      dark: colors.accent.orange,       // #CA6702 - Dark Orange
      contrastText: colors.text.primary,
    },
    success: {
      main: colors.primary.medium,      // #0A9396 - Teal
      dark: colors.primary.dark,        // #005F73 - Dark Teal
      light: colors.primary.light,      // #94D2BD - Light Teal
      contrastText: colors.text.white,
    },
    background: {
      default: colors.background.primary, // #E9D8A6 - Light Beige
      paper: colors.text.white,
    },
    text: {
      primary: colors.text.primary,     // #001219 - Very Dark Blue
      secondary: colors.text.secondary, // #005F73 - Dark Teal
      disabled: colors.text.light,      // #94D2BD - Light Teal
    },
    divider: colors.border.light,       // #94D2BD - Light Teal
  },
  typography: {
    fontFamily: typography.fontFamily.primary,
    h1: {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h2: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h3: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h4: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    h5: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    h6: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    body1: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    button: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none', // Disable uppercase transform
    },
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.sm,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
  ],
  shape: {
    borderRadius: 8, // md border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          minHeight: 44,
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadows.sm,
          },
        },
        containedPrimary: {
          backgroundColor: colors.button.primary,
          color: colors.text.white,
          '&:hover': {
            backgroundColor: colors.button.primaryHover,
          },
        },
        containedSecondary: {
          backgroundColor: colors.button.secondary,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.button.secondaryHover,
            color: colors.text.white,
          },
        },
        containedError: {
          backgroundColor: colors.button.danger,
          color: colors.text.white,
          '&:hover': {
            backgroundColor: colors.button.dangerHover,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.text.white,
            '& fieldset': {
              borderColor: colors.border.light,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.border.medium,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.medium,
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: colors.status.error,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.text.secondary,
            fontWeight: typography.fontWeight.medium,
            '&.Mui-focused': {
              color: colors.primary.medium,
            },
            '&.Mui-error': {
              color: colors.status.error,
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 16px',
            fontSize: typography.fontSize.base,
            fontFamily: typography.fontFamily.primary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: shadows.lg,
          backgroundColor: colors.text.white,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.text.white,
        },
      },
    },
  },
  custom: {
    colors,
  },
});