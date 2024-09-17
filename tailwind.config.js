import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // update colors here
        primary: '#dF4830',
        secondary: '#f8fafc', // slate-50
        tertiary: '#38bdf8', // sky-400
        quaternary: '#fdba74', // orange-300
        quinary: '#22c55e', // green-500
        senary: '#ef4444', // red-500
        septenary: '#020617', // slate-950
        bgPrimary: '#ea580c',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      layout: {},
    }),
  ],
};
