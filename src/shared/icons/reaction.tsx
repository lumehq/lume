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
        fillRule="evenodd"
        d="M19 1a.75.75 0 01.75.75v2.5h2.5a.75.75 0 110 1.5h-2.5v2.5a.75.75 0 11-1.5 0v-2.5h-2.5a.75.75 0 110-1.5h2.5v-2.5A.75.75 0 0119 1z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        d="M10.5 9.5c0 .828-.56 1.5-1.25 1.5S8 10.328 8 9.5 8.56 8 9.25 8s1.25.672 1.25 1.5zM16 9.5c0 .828-.56 1.5-1.25 1.5s-1.25-.672-1.25-1.5.56-1.5 1.25-1.5S16 8.672 16 9.5z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.642 14.298a.75.75 0 011.06 0 3.25 3.25 0 004.597 0 .75.75 0 011.06 1.06 4.75 4.75 0 01-6.717 0 .75.75 0 010-1.06z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 3.5a8.5 8.5 0 108.5 8.5.75.75 0 011.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2a.75.75 0 010 1.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
