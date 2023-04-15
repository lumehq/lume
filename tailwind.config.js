/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        input: `
          0px 1px 0px -1px var(--tw-shadow-color),
          0px 1px 1px -1px var(--tw-shadow-color),
          0px 1px 2px -1px var(--tw-shadow-color),
          0px 2px 4px -2px var(--tw-shadow-color),
          0px 3px 6px -3px var(--tw-shadow-color)
        `,
        highlight: `
          inset 0px 0px 0px 1px var(--tw-shadow-color),
          inset 0px 1px 0px var(--tw-shadow-color)
        `,
        modal: `
          0 -2px 6px hsl(0deg 0% 100% / 17%),
          0 5px 18px rgb(0 0 0 / 40%),
          0 4px 40px 8px rgb(0 0 0 / 40%),
          0 1px 4px -1px rgb(0 0 0 / 30%),
          inset 0 0 0 0.3px hsl(0deg 0% 100% / 30%),
          0 0 0 0.5px hsl(0deg 0% 100% / 40%);
        `,
        inner: `
          0 2px 2px rgb(4 4 7 / 45%),
          0 8px 24px rgb(4 4 7 / 60%)
        `,
        button: `
          rgba(112, 26, 117, 0.5) 0px 2px 8px,
          rgb(112, 26, 117) 0px 2px 4px,
          rgb(112, 26, 117) 0px 0px 0px 1px,
          rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset
        `,
      },
      backgroundColor: {
        'near-black': '#07070d',
        'white/2.5': 'hsla(0,0%,100%,.025)',
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        fade: 'linear-gradient(120deg, #000, transparent 30%, transparent 70%, #000)',
      },
      keyframes: {
        disco: {
          '0%': { transform: 'translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateY(-50%) rotate(360deg)' },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
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
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        moveBg: {
          '0%': { backgroundPosition: '50px' },
          '20%': { backgroundPosition: '150px' },
          '40%': { backgroundPosition: '250px' },
          '60%': { backgroundPosition: '350px' },
          '80%': { backgroundPosition: '450px' },
          '100%': { backgroundPosition: '550px' },
        },
      },
      animation: {
        disco: 'disco 1.5s linear infinite',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        moveBg: 'moveBg 3s ease-in-out infinite alternate running forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
