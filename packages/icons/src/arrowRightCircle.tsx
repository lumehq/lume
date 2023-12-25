import { SVGProps } from 'react';

export function ArrowRightCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
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
        d="M7.75 12h8M13 8.75l2.896 2.896a.5.5 0 010 .708L13 15.25M21.25 12a9.25 9.25 0 11-18.5 0 9.25 9.25 0 0118.5 0z"
      />
    </svg>
  );
}
