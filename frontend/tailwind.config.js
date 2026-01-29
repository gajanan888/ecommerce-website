module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium e-commerce palette
        // International Orange & Jet Black Theme
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF4D00', // International Orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        secondary: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#0A0A0A', // Jet Black
        },
        success: '#22C55E',
        discount: '#EF4444',
        stars: '#FACC15',
        background: '#F8FAFC',
        footer: '#020617',
      },
      backgroundColor: {
        card: '#FFFFFF',
      },
      textColor: {
        primary: '#0F172A',
        secondary: '#475569',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md':
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl':
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%': {
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          '100%': {
            boxShadow:
              '0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 10px 10px -5px rgba(37, 99, 235, 0.1)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        floatUpDown: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1)' },
        },
        blurIn: {
          from: {
            backdropFilter: 'blur(0px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
          to: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
          },
        },
        cardLift: {
          '0%': { transform: 'translateY(0) translateZ(0)' },
          '100%': { transform: 'translateY(-8px) translateZ(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '50%': { boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        fadeInDown: 'fadeInDown 0.5s ease-out',
        fadeInLeft: 'fadeInLeft 0.6s ease-out',
        fadeInRight: 'fadeInRight 0.6s ease-out',
        scaleUp: 'scaleUp 0.5s ease-out',
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-slower': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'float-hero': 'floatUpDown 3.5s ease-in-out infinite',
        'float-hero-slow': 'floatUpDown 4.5s ease-in-out infinite 0.5s',
        heartbeat: 'heartbeat 0.6s cubic-bezier(0.6, 0, 0.7, 1)',
        'navbar-scrolled': 'blurIn 0.3s ease-out forwards',
        'card-lift': 'cardLift 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in': 'slideIn 0.5s ease-out',
        'badge-pulse': 'badgePulse 2s infinite',
        'gradient-flow': 'gradientFlow 3s ease infinite',
      },
    },
  },
  plugins: [],
};
