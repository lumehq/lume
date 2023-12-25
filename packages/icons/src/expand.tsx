import { SVGProps } from 'react';

export function ExpandIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M13.75 3.75h5.75a.75.75 0 01.75.75v5.75m-16.5 3.5v5.75c0 .414.336.75.75.75h5.75M19.5 4.5L14 10m-4 4l-5.5 5.5"
      ></path>
    </svg>
  );
}
