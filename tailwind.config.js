/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs principales basées sur votre design
        primary: {
          50: '#eef2ff', // Très clair
          100: '#e0e7ff', // Clair
          200: '#c7d2fe', // Plus clair
          300: '#a5b4fc', // Clair moyen
          400: '#818cf8', // Moyen
          500: '#6366f1', // indigo-500 (hover)
          600: '#4f46e5', // indigo-600 (principal)
          700: '#4338ca', // Plus foncé
          800: '#3730a3', // Foncé
          900: '#312e81', // Très foncé
        },

        // Couleurs secondaires (greys)
        neutral: {
          50: '#f9fafb', // Presque blanc
          100: '#f3f4f6', // Très clair
          200: '#e5e7eb', // gray-200 (diviseurs)
          300: '#d1d5db', // gray-300 (bordures)
          400: '#9ca3af', // gray-400 (placeholders)
          500: '#6b7280', // gray-500 (texte secondaire)
          600: '#4b5563', // Moyen
          700: '#374151', // Plus foncé
          800: '#1f2937', // Foncé
          900: '#111827', // gray-900 (texte principal)
        },

        // Couleurs d'état et utilitaires
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },

        // Couleurs sémantiques pour votre application
        background: {
          primary: '#ffffff', // Blanc principal
          secondary: '#f9fafb', // Gris très clair
        },

        text: {
          primary: '#111827', // gray-900 - texte principal
          secondary: '#6b7280', // gray-500 - texte secondaire
          muted: '#9ca3af', // gray-400 - placeholders
        },

        border: {
          light: '#e5e7eb', // gray-200
          default: '#d1d5db', // gray-300
          dark: '#9ca3af', // gray-400
        },
      },

      // Variables CSS personnalisées pour une meilleure maintenance
      backgroundColor: {
        'app-primary': '#ffffff',
        'app-secondary': '#f9fafb',
      },

      textColor: {
        'app-primary': '#111827',
        'app-secondary': '#6b7280',
        'app-muted': '#9ca3af',
      },

      borderColor: {
        'app-light': '#e5e7eb',
        'app-default': '#d1d5db',
        'app-dark': '#9ca3af',
      },

      ringColor: {
        'app-focus': '#4f46e5', // primary-600
      },
    },
  },
  plugins: [],
}
