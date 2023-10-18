import { SVGProps } from 'react';

export function SpaceIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M14.522 2.261a4 4 0 00-5.044 0l-5 4.062A4 4 0 003 9.428V17a4 4 0 004 4h10a4 4 0 004-4V9.428a4 4 0 00-1.478-3.105l-5-4.062zM8 15a1 1 0 100 2h8a1 1 0 100-2H8z"
        clipRule="evenodd"
      />
    </svg>
  );
}
