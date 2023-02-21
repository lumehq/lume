/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
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
      },
      backgroundColor: {
        'near-black': '#07070d',
        'white/2.5': 'hsla(0,0%,100%,.025)',
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        disco: {
          '0%': { transform: 'translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateY(-50%) rotate(360deg)' },
        },
      },
      animation: {
        disco: 'disco 1.5s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
