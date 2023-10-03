import { SVGProps } from 'react';

export function NwcIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.496 12.886a1 1 0 011.008 0l3 1.75A1 1 0 0110 15.5V19a1 1 0 01-.496.864l-3 1.75a1 1 0 01-1.008 0l-3-1.75A1 1 0 012 19v-3.5a1 1 0 01.496-.864l3-1.75zM4 16.074v2.352l2 1.166 2-1.166v-2.352l-2-1.166-2 1.166z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17 8a4 4 0 014 4v5a4 4 0 01-4 4h-5v-5.5a3 3 0 00-1.488-2.591l-3-1.75a3 3 0 00-3.024 0L3 12.027V6.5A3.5 3.5 0 016.5 3H14a3 3 0 013 3v2zM6.5 5a1.5 1.5 0 100 3H15V6a1 1 0 00-1-1H6.5zm9 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
