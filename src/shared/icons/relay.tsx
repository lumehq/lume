import { SVGProps } from 'react';

export function RelayIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M4 5a3 3 0 013-3h10a3 3 0 013 3v11c0 .889-.386 1.687-1 2.236V20a2 2 0 01-2 2H7a2 2 0 01-2-2v-1.75-.014c-.614-.55-1-1.348-1-2.236V5zm3-1a1 1 0 00-1 1v11a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H7zm0 2a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H8a1 1 0 01-1-1V6zm6 9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
