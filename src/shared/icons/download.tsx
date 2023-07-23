import { SVGProps } from 'react';

export function DownloadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M20.25 14.75v4.5a1 1 0 01-1 1H4.75a1 1 0 01-1-1v-4.5M12 15V3.75M12 15l-3.5-3.5M12 15l3.5-3.5"
      ></path>
    </svg>
  );
}
