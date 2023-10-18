import { SVGProps } from 'react';

export function ChatsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M19.002 3a3 3 0 013 3v6a3 3 0 01-3 3h-1v1a3 3 0 01-3 3h-4.24l-4.274 2.374a1 1 0 01-1.486-.874V19a3 3 0 01-3-3v-6a3 3 0 013-3h1V6a3 3 0 013-3h10zm-11 4h7a3 3 0 013 3v3h1a1 1 0 001-1V6a1 1 0 00-1-1h-10a1 1 0 00-1 1v1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
