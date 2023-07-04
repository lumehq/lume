import { SVGProps } from 'react';

export function EditIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.25 6.25L17 2.5L21.5 7L17.75 10.75M13.25 6.25L2.75 16.75V21.25H7.25L17.75 10.75M13.25 6.25L17.75 10.75"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
