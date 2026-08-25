/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zone1: '#3b82f6', // Bleu Récupération
        zone2: '#10b981', // Vert Endurance
        zone3: '#f59e0b', // Jaune Tempo
        zone4: '#f97316', // Orange Seuil
        zone5: '#ef4444', // Rouge VO2max
        zone6: '#dc2626', // Rouge Foncé Anaérobie
        zone7: '#a855f7', // Violet Neuromusculaire
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
