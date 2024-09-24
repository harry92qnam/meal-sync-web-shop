import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
  plugins: [nextui()],
};
export default config;
