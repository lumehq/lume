import { SVGProps } from 'react';

export function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M10.108 1.999a3 3 0 013.784 0l6 4.875A3 3 0 0121 9.202V18a3 3 0 01-3 3H6a3 3 0 01-3-3V9.202a3 3 0 011.108-2.328l6-4.875zM8 15a1 1 0 100 2h8a1 1 0 100-2H8z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
