import { SVGProps } from 'react';

export function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M8.75 6.75h6.5m-6.5 4h6.5m-6.5 4h2.5m-5.5 6.5h12.5a1 1 0 001-1V3.75a1 1 0 00-1-1H5.75a1 1 0 00-1 1v16.5a1 1 0 001 1z"
      />
    </svg>
  );
}
