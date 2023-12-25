import { SVGProps } from 'react';

export function UnfollowIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M17.748 11.25h4.5m-7.5-4.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM3.67 19.166C4.432 15.773 7.203 13.25 11 13.25c3.795 0 6.566 2.524 7.328 5.916.13.575-.338 1.084-.927 1.084H4.597c-.59 0-1.056-.51-.927-1.084z"
      />
    </svg>
  );
}
