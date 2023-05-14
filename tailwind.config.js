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
        popover: `0px 0px 7px rgba(0,0,0,0.52)`,
        inner: `
          0 2px 2px rgb(4 4 7 / 45%),
          0 8px 24px rgb(4 4 7 / 60%)
        `,
        button: `
          rgba(74, 4, 78, 0.5) 0px 2px 8px,
          rgb(74, 4, 78) 0px 2px 4px,
          rgb(74, 4, 78) 0px 0px 0px 1px,
          rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset
        `,
        'mini-button': `
          rgba(13, 16, 23, 0.36) 0px 2px 8px,
          rgba(13, 16, 23, 0.36) 0px 2px 4px,
          rgba(13, 16, 23, 0.36) 0px 0px 0px 1px,
          rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset
        `,
      },
      backgroundImage: {
        fade: 'linear-gradient(120deg, #000, transparent 30%, transparent 70%, #000)',
      },
      keyframes: {
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
        moveBg: 'moveBg 3s ease-in-out infinite alternate running forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
