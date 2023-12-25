import { SVGProps } from 'react';

export function ArticleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M16.25 12V4.75a1 1 0 00-1-1H3.75a1 1 0 00-1 1v13a2.5 2.5 0 002.5 2.5H18.5M16.25 12v5.75a2.5 2.5 0 005 0V13a1 1 0 00-1-1h-4zm-9.5 3.75h5.5m-5.5-8h5.5v4.5h-5.5v-4.5z"
      ></path>
    </svg>
  );
}
