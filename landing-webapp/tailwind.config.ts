import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-instrument-sans)", "system-ui", "sans-serif"],
        "instrument-sans": ["var(--font-instrument-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float-up-down': 'floatUpDown 3s ease-in-out infinite',
        'float-left-right': 'floatLeftRight 4s ease-in-out infinite',
      },
      keyframes: {
        floatUpDown: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-35px)' },
        },
        floatLeftRight: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-25px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
