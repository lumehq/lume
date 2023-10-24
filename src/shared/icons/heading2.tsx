import { SVGProps } from 'react';

export function Heading2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        strokeWidth="2"
        d="M13 5v7m0 0v7m0-7H3m0-7v7m0 0v7m19 0h-4l3.495-4.432A2 2 0 0022 13.24V13a2 2 0 00-3.732-1"
      ></path>
    </svg>
  );
}
