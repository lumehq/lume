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
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 21.25c4.28 0 7.75-3.75 7.75-8.25 0-5.167-4.613-8.829-6.471-10.094-.426-.29-.988-.165-1.285.257L9.582 6.59a1.002 1.002 0 01-1.525.131c-.39-.387-1.026-.391-1.376.033C5.06 8.718 4.25 11.16 4.25 13c0 4.5 3.47 8.25 7.75 8.25zm0 0c1.657 0 3-1.533 3-3.424 0-2.084-1.663-3.601-2.513-4.24a.802.802 0 00-.974 0c-.85.639-2.513 2.156-2.513 4.24 0 1.89 1.343 3.424 3 3.424z"
      ></path>
    </svg>
  );
}
