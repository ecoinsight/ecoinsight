/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // green-600 (Darker for better contrast on light)
          light: '#4ade80',   // green-400
          dark: '#15803d',    // green-700
        },
        secondary: {
          DEFAULT: '#0284c7', // sky-600 (Darker for better contrast)
          light: '#38bdf8',   // sky-400
          dark: '#0369a1',    // sky-700
        },
        neutral: {
          900: '#0f172a', // slate-900
          800: '#1e293b', // slate-800
          700: '#334155', // slate-700
          600: '#475569', // slate-600
          500: '#64748b', // slate-500
          400: '#94a3b8', // slate-400
          300: '#cbd5e1', // slate-300
          200: '#e2e8f0', // slate-200
          100: '#f1f5f9', // slate-100
          50: '#f8fafc',  // slate-50
        },
        background: '#f8fafc', // slate-50 (Light Background)
        surface: '#ffffff',    // white (Light Surface)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
