/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#F0F5FA',
          100: '#E2EAF4',
          200: '#C5D6E8',
          300: '#9DBDDD',
          400: '#699CCF',
          500: '#3D7CBD',
          600: '#1D5C9B',
          700: '#134074',
          800: '#0B2545',
          900: '#061629',
          950: '#030C17',
        },
        compliant: {
          light: '#DCFCE7',
          DEFAULT: '#16A34A',
          dark: '#14532D',
          border: '#86EFAC',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#D97706',
          dark: '#78350F',
          border: '#FCD34D',
        },
        critical: {
          light: '#FEE2E2',
          DEFAULT: '#DC2626',
          dark: '#7F1D1D',
          border: '#FCA5A5',
        },
        info: {
          light: '#DBEAFE',
          DEFAULT: '#2563EB',
          dark: '#1E3A8A',
          border: '#93C5FD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
