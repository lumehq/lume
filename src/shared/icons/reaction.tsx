import { SVGProps } from 'react';

export function ReactionIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M10.499 9.5c0 .828-.56 1.5-1.25 1.5s-1.25-.672-1.25-1.5.56-1.5 1.25-1.5 1.25.672 1.25 1.5zM15.999 9.5c0 .828-.56 1.5-1.25 1.5s-1.25-.672-1.25-1.5.56-1.5 1.25-1.5 1.25.672 1.25 1.5z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18.999 1a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0V6h-2a1 1 0 010-2h2V2a1 1 0 011-1zm-7.006 1.945a1 1 0 01-.884 1.104 8.001 8.001 0 108.842 8.841 1 1 0 011.988.22C21.386 18.11 17.148 22 12 22 6.477 22 2 17.523 2 12c0-5.147 3.888-9.385 8.889-9.939a1 1 0 011.104.884zm-3.53 11.176a1 1 0 011.415 0 3 3 0 004.242 0 1 1 0 011.415 1.415 5 5 0 01-7.072 0 1 1 0 010-1.415z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
