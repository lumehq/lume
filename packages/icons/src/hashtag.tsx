import { SVGProps } from 'react';

export function HashtagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.75 3.75l-2 16.5m10.5-16.5l-2 16.5M3.75 7.75h16.5m0 8.5H3.75"
      ></path>
    </svg>
  );
}
