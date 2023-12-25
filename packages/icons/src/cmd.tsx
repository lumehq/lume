import { SVGProps } from 'react';

export function CommandIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        strokeWidth="1.5"
        d="M9.25 9.25V6.5A2.75 2.75 0 106.5 9.25h2.75zm0 0h5.5m-5.5 0v5.5m5.5-5.5V6.5a2.75 2.75 0 112.75 2.75h-2.75zm0 0v5.5m0 0h-5.5m5.5 0v2.75a2.75 2.75 0 102.75-2.75h-2.75zm-5.5 0v2.75a2.75 2.75 0 11-2.75-2.75h2.75z"
      />
    </svg>
  );
}
