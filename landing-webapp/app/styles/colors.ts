// Color variables for Glass AI Misinformation Detection App
// Based on the design brief: Blue & white (trust, reliability) + accent red/yellow for warnings

export const colors = {
  // Primary Colors (Trust & Reliability)
  primary: {
    50: 'bg-blue-50',
    100: 'bg-blue-100',
    200: 'bg-blue-200',
    300: 'bg-blue-300',
    400: 'bg-blue-400',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
    700: 'bg-blue-700',
    800: 'bg-blue-800',
    900: 'bg-blue-900',
  },

  // Text Colors
  text: {
    primary: 'text-blue-900',
    secondary: 'text-gray-700',
    light: 'text-gray-500',
    white: 'text-white',
    dark: 'text-gray-900',
  },

  // Background Colors
  background: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    dark: 'bg-gray-900',
    blue: 'bg-blue-600',
    lightBlue: 'bg-blue-50',
  },

  // Warning Colors (Red/Yellow for alerts)
  warning: {
    red: {
      50: 'bg-red-50',
      100: 'bg-red-100',
      200: 'bg-red-200',
      300: 'bg-red-300',
      400: 'bg-red-400',
      500: 'bg-red-500',
      600: 'bg-red-600',
      700: 'bg-red-700',
      800: 'bg-red-800',
      900: 'bg-red-900',
    },
    yellow: {
      50: 'bg-yellow-50',
      100: 'bg-yellow-100',
      200: 'bg-yellow-200',
      300: 'bg-yellow-300',
      400: 'bg-yellow-400',
      500: 'bg-yellow-500',
      600: 'bg-yellow-600',
      700: 'bg-yellow-700',
      800: 'bg-yellow-800',
      900: 'bg-yellow-900',
    },
  },

  // Border Colors
  border: {
    primary: 'border-blue-200',
    secondary: 'border-gray-200',
    warning: 'border-red-300',
    light: 'border-gray-100',
  },

  // Button Colors
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    warning: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  },

  // Status Colors
  status: {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  },

  // Custom Colors
  custom: {
    'Blue-dark-bg': 'bg-[#85B5D9]',
  },
} as const;

// Example usage:
// import { colors } from '@/app/styles/colors';
// 
// <div className={`${colors.background.primary} ${colors.text.primary}`}>
//   <button className={colors.button.primary}>
//     Download App
//   </button>
//   <div className={colors.warning.red[500]}>
//     Misinformation Detected!
//   </div>
// </div>

export default colors;
