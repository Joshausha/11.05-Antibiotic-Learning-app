/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'medical': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Enhanced primary colors for medical context
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdff',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        
        // Northwestern Medical Route Colors
        'medical-oral': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',     // Primary oral color
          700: '#b91c1c',
          800: '#991b1b',     // Border/text color
          900: '#7f1d1d',
        },
        'medical-iv': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',     // Primary IV color
          700: '#1d4ed8',     // Border/text color
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'medical-both': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',     // Primary both routes color
          800: '#6b21a8',
          900: '#5b21b6',     // Border/text color
        },

        // Northwestern Segment Colors (Clinical Significance Based)
        'segment-mrsa': {
          light: '#fed7aa',   // Secondary/low coverage
          DEFAULT: '#f97316', // Primary/high coverage
          dark: '#9a3412',    // Text color
        },
        'segment-vre': {
          light: '#fecaca',
          DEFAULT: '#dc2626',
          dark: '#991b1b',
        },
        'segment-anaerobes': {
          light: '#ddd6fe',
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
        },
        'segment-atypicals': {
          light: '#cffafe',
          DEFAULT: '#0891b2',
          dark: '#155e75',
        },
        'segment-pseudomonas': {
          light: '#fde68a',
          DEFAULT: '#d97706',
          dark: '#92400e',
        },
        'segment-gram-negative': {
          light: '#dbeafe',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        'segment-mssa': {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        },
        'segment-e-faecalis': {
          light: '#e2e8f0',
          DEFAULT: '#64748b',
          dark: '#334155',
        },

        // Clinical Status Colors
        'clinical-high-alert': '#f97316',    // Orange for MRSA
        'clinical-critical': '#dc2626',      // Red for VRE
        'clinical-specialized': '#7c3aed',   // Purple for anaerobes
        'clinical-atypical': '#0891b2',      // Teal for atypicals
        'clinical-opportunistic': '#d97706', // Amber for pseudomonas
        'clinical-broad-spectrum': '#2563eb',// Blue for gram-negative
        'clinical-treatable': '#16a34a',     // Green for MSSA
        'clinical-standard': '#64748b',      // Gray for E. faecalis

        // Coverage Level Colors
        'coverage-none': '#ffffff',          // No coverage - white
        'coverage-limited': 'var(--segment-secondary)', // Limited - segment secondary
        'coverage-excellent': 'var(--segment-primary)', // Excellent - segment primary

        // Enhanced semantic colors for medical use
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',  // Medical treatable green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Medical caution amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',  // Medical critical red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // High contrast clinical colors
        'clinical-bg': '#ffffff',
        'clinical-text': '#000000',
        'clinical-emergency': '#ff0000',
        'clinical-border': '#000000',

        // Surface colors for layered UI
        surface: {
          elevated: '#ffffff',
          default: '#fafafa',
          sunken: '#f1f5f9',
          overlay: 'rgba(0, 0, 0, 0.4)',
        },
      },

      // Clinical gradient backgrounds
      backgroundImage: {
        'gradient-clinical': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        'gradient-clinical-subtle': 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        'gradient-success': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        'gradient-warning': 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        'gradient-card': 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
      },

      // Medical typography scale
      fontSize: {
        'medical-xs': ['0.7rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'medical-sm': ['0.8rem', { lineHeight: '1.125rem', letterSpacing: '0.025em' }],
        'medical-base': ['0.9rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'medical-lg': ['1rem', { lineHeight: '1.375rem', letterSpacing: '0.01em' }],
        'medical-xl': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
        'medical-emergency': ['1.25rem', { lineHeight: '1.625rem', letterSpacing: '0.02em', fontWeight: '700' }],
        // Display typography for headers
        'display-xl': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['2rem', { lineHeight: '1.15', fontWeight: '600' }],
        'display-md': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
      },

      // Medical spacing scale (optimized for clinical workflows)
      spacing: {
        'medical-xs': '0.25rem',   // 4px
        'medical-sm': '0.5rem',    // 8px
        'medical-md': '0.75rem',   // 12px
        'medical-lg': '1rem',      // 16px
        'medical-xl': '1.5rem',    // 24px
        'medical-2xl': '2rem',     // 32px
        'touch-target': '2.75rem', // 44px - minimum touch target
      },

      // Medical border radius
      borderRadius: {
        'medical': '0.375rem',     // 6px - professional rounded
        'medical-lg': '0.5rem',    // 8px - larger elements
        'pill': '9999px',          // Full round for badges
      },

      // Medical shadows
      boxShadow: {
        'medical-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medical': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medical-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'medical-emergency': '0 8px 25px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.1)',
        'clinical-focus': '0 0 0 4px rgba(37, 99, 235, 0.25)',
        'segment-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'segment-selected': '0 6px 20px rgba(0, 0, 0, 0.25)',
        // Clinical professional shadow system
        'clinical-sm': '0 1px 2px 0 rgba(30, 64, 175, 0.05)',
        'clinical': '0 1px 3px 0 rgba(30, 64, 175, 0.08), 0 1px 2px -1px rgba(30, 64, 175, 0.08)',
        'clinical-md': '0 4px 6px -1px rgba(30, 64, 175, 0.08), 0 2px 4px -2px rgba(30, 64, 175, 0.06)',
        'clinical-lg': '0 10px 15px -3px rgba(30, 64, 175, 0.08), 0 4px 6px -4px rgba(30, 64, 175, 0.06)',
        'clinical-xl': '0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 8px 10px -6px rgba(30, 64, 175, 0.08)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
      },

      // Enhanced animations for medical interface
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out',
        'medical-loading': 'medicalPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'segment-appear': 'segmentAppear 0.4s ease-out',
        'tooltip-appear': 'tooltipAppear 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        medicalPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        segmentAppear: {
          '0%': { 
            transform: 'scale(0.8) rotateY(90deg)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'scale(1) rotateY(0deg)', 
            opacity: '1' 
          },
        },
        tooltipAppear: {
          '0%': { 
            transform: 'translateY(10px) scale(0.95)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: '1' 
          },
        },
      },

      // Medical breakpoints for clinical devices
      screens: {
        'mobile-clinical': '375px',   // Clinical mobile devices
        'tablet-clinical': '768px',   // Clinical tablets
        'desktop-clinical': '1200px', // Clinical workstations
      },

      // Medical-specific transition timing
      transitionDuration: {
        'medical-fast': '150ms',      // Quick feedback
        'medical-standard': '200ms',  // Standard interactions
        'medical-slow': '300ms',      // Complex transitions
      },

      // Medical interaction states
      opacity: {
        'medical-disabled': '0.4',
        'medical-muted': '0.6',
        'medical-subtle': '0.8',
        'medical-hover': '0.9',
      },

      // Medical z-index scale
      zIndex: {
        'tooltip': '50',
        'modal': '100',
        'emergency': '999',
      },
    },
  },
  
  // Add custom CSS variables support
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Medical focus utilities
        '.focus-medical': {
          '@apply outline-none ring-2 ring-blue-600 ring-offset-2': {},
        },
        '.focus-emergency': {
          '@apply outline-none ring-4 ring-red-500 ring-offset-2': {},
        },
        
        // Northwestern segment utilities
        '.segment-base': {
          '@apply transition-all duration-medical-standard cursor-pointer': {},
        },
        '.segment-hover': {
          '@apply brightness-110 shadow-segment-hover': {},
        },
        '.segment-selected': {
          '@apply ring-2 ring-black ring-offset-2 shadow-segment-selected': {},
        },
        '.segment-contraindicated': {
          '@apply opacity-medical-muted border-2 border-red-600': {},
        },
        
        // Medical text utilities
        '.text-medical-emergency': {
          'font-weight': '700',
          'color': theme('colors.red.600'),
          'font-size': theme('fontSize.medical-emergency')[0],
          'line-height': theme('fontSize.medical-emergency')[1].lineHeight,
        },
        '.text-medical-critical': {
          'font-weight': '600',
          'color': theme('colors.red.700'),
        },
        '.text-medical-caution': {
          'font-weight': '500',
          'color': theme('colors.yellow.700'),
        },
        '.text-medical-safe': {
          'font-weight': '500',
          'color': theme('colors.green.700'),
        },
        
        // Clinical environment utilities
        '.clinical-high-contrast': {
          'background': theme('colors.white'),
          'color': theme('colors.black'),
          'border-color': theme('colors.black'),
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          'min-width': theme('spacing.touch-target'),
          'min-height': theme('spacing.touch-target'),
        },
        
        // Medical card utilities  
        '.medical-card': {
          '@apply bg-white rounded-medical shadow-medical border border-gray-200 p-medical-lg': {},
        },
        '.medical-card-hover': {
          '@apply hover:shadow-medical-lg transition-shadow duration-medical-standard': {},
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}