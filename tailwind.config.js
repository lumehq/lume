/** @type {import('tailwindcss').Config} */
import harmonyPalette from '@evilmartians/harmony/tailwind';

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'index.html'],
  theme: {
    colors: harmonyPalette,
    extend: {
      colors: {
        // 'international orange'
        interor: {
          50: 'hsl(32, 100%, 96%)',
          100: 'hsl(34, 100%, 91%)',
          200: 'hsl(31, 100%, 82%)',
          300: 'hsl(30, 100%, 71%)',
          400: 'hsl(26, 100%, 60%)',
          500: 'hsl(23, 100%, 52%)',
          600: 'hsl(19, 100%, 50%)',
          700: 'hsl(15, 98%, 40%)',
          800: 'hsl(13, 87%, 34%)',
          900: 'hsl(13, 83%, 28%)',
          950: 'hsl(11, 89%, 15%)',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        white: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.white/50'),
            '--tw-prose-links': theme('colors.fuchsia[400]'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.white/50'),
            '--tw-prose-bullets': theme('colors.white/50'),
            '--tw-prose-hr': theme('colors.white/10'),
            '--tw-prose-quotes': theme('colors.white/50'),
            '--tw-prose-quote-borders': theme('colors.white/50'),
            '--tw-prose-captions': theme('colors.white/50'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-pre-code': theme('colors.white/50'),
            '--tw-prose-pre-bg': theme('colors.white/10'),
            '--tw-prose-th-borders': theme('colors.white/10'),
            '--tw-prose-td-borders': theme('colors.white/10'),
          },
        },
      }),
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.6, 0.6, 0, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
