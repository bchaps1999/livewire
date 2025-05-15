/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'], // For large headings
        outfit: ['Outfit', 'sans-serif'], // Logo font
      },
      colors: {
        paper: {
          50: '#FFFCF7',
          100: '#FAF7F2',
          200: '#F5F1EA',
          300: '#EAE5DC',
          400: '#D8D0C3',
          500: '#B6AA96',
        },
        ink: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c9c9c9',
          300: '#afafaf',
          400: '#949494',
          500: '#7a7a7a',
          600: '#606060',
          700: '#464646',
          800: '#2d2d2d',
          900: '#131313',
        },
        accent: {
          red: '#A52A2A',
          blue: '#2B4D6F',
          gold: '#AD8E3A',
          green: '#047857',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#047857', // Main green color from sample
          800: '#065F46',
          900: '#064E3B',
        },
        'accent-blue': '#3B82F6', // Example blue
        'accent-gold': '#F59E0B', // Example gold
        // Update category colors to match the image better
        'climate': '#3498db',      // A nicer blue for climate
        'ai-ethics': '#9b59b6',    // Purple for AI Ethics
        'chip': '#e74c3c',         // Red for chip stories
        'quantum': '#f1c40f',      // Yellow for quantum
      },
      boxShadow: {
        'newspaper': '0 4px 6px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)', // Enhanced shadow
        'newspaper-lg': '0 10px 20px -3px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)',
        'newspaper-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
        'feed-item': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'card-edge': '0 1px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        'feed-container': '0 2px 10px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)', // New shadow for feed container
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#292524',
            a: {
              color: '#2B4D6F',
              textDecoration: 'none',
              '&:hover': {
                color: '#1E3A54',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
              },
            },
            h1: {
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            blockquote: {
              fontFamily: 'Outfit, sans-serif',
              fontStyle: 'italic',
              fontWeight: '500',
              borderLeftColor: '#B6AA96',
              color: '#44403C',
            },
            code: {
              color: '#A52A2A',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            strong: {
              fontWeight: '600',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Add feed-specific design elements
      borderRadius: {
        'card': '0.375rem',
      },
      spacing: {
        '18': '4.5rem',
      },
      backgroundColor: {
        'card-hover': 'rgba(0, 0, 0, 0.02)',
        'climate': '#3498db', // Light blue for climate
        'ai-ethics': '#9b59b6', // Purple for AI Ethics
        'chip': '#e74c3c', // Red for chip/electronics
        'quantum': '#f1c40f', // Yellow for quantum computing
      },
      maxWidth: {
        'feed': 'none', // Allow full width
        'sidebar': '20rem',
      },
      minHeight: {
        'card': '5rem',
      },
      gridTemplateColumns: {
        'layout': 'auto 1fr',
      },
      // Add border styles for more defined edges
      borderWidth: {
        'edge': '1px',
      },
      borderColor: {
        'edge': 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
