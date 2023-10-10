import { SVGProps } from 'react';

export function HorizontalDotsIcon(
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
        strokeWidth="2"
        d="M12 13a1 1 0 100-2 1 1 0 000 2zM20 13a1 1 0 100-2 1 1 0 000 2zM4 13a1 1 0 100-2 1 1 0 000 2z"
      ></path>
    </svg>
  );
}
