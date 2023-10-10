import { SVGProps } from 'react';

export function RepostIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M17.957 2.293a1 1 0 10-1.414 1.414L17.836 5H6a3 3 0 00-3 3v3a1 1 0 102 0V8a1 1 0 011-1h11.836l-1.293 1.293a1 1 0 001.414 1.414l2.47-2.47a1.75 1.75 0 000-2.474l-2.47-2.47zM20 12a1 1 0 011 1v3a3 3 0 01-3 3H6.164l1.293 1.293a1 1 0 11-1.414 1.414l-2.47-2.47a1.75 1.75 0 010-2.474l2.47-2.47a1 1 0 011.414 1.414L6.164 17H18a1 1 0 001-1v-3a1 1 0 011-1z"
      ></path>
    </svg>
  );
}
