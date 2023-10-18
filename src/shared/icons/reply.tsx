import { SVGProps } from 'react';

export function ReplyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        strokeWidth="2"
        d="M12 21a9 9 0 10-9-9c0 1.354.3 2.639.835 3.791.102.219.133.465.076.7l-.778 3.191a1 1 0 001.191 1.213l3.33-.752c.224-.05.458-.02.667.073A8.969 8.969 0 0012 21z"
      ></path>
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="0.75"
        d="M6.625 12a.875.875 0 101.75 0 .875.875 0 00-1.75 0zm4.5 0a.875.875 0 101.75 0 .875.875 0 00-1.75 0zm4.5 0a.875.875 0 101.75 0 .875.875 0 00-1.75 0z"
      ></path>
    </svg>
  );
}
