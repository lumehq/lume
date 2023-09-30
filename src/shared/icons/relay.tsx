import { SVGProps } from 'react';

export function RelayIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21.25 12V5.75a1 1 0 00-1-1H3.75a1 1 0 00-1 1V12m18.5 0H2.75m18.5 0v6.25a1 1 0 01-1 1H3.75a1 1 0 01-1-1V12"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        d="M6.5 9.125a.75.75 0 100-1.5.75.75 0 000 1.5zm0 7.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      />
    </svg>
  );
}
