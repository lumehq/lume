import { SVGProps } from 'react';

export function GroupFeedsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M14.425 13.18c3.361-1.396 7.598.605 8.454 6.003.09.573-.372 1.067-.952 1.067H16.75M10.75 7a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0zm9 0a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0zm-6.966 13.25H2.072c-.58 0-1.042-.497-.951-1.07 1.362-8.573 11.252-8.573 12.614 0 .091.573-.371 1.07-.951 1.07z"
      ></path>
    </svg>
  );
}
