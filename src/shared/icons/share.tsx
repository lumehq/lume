import { SVGProps } from 'react';

export function ShareIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M22.085 11.628l-8.501-7.63a.5.5 0 00-.834.373V8.5C4.25 8.5 2 11.75 2 20.25c1.5-3 2.25-4.75 10.75-4.75v4.129a.5.5 0 00.834.372l8.501-7.63a.5.5 0 000-.744z"
      ></path>
    </svg>
  );
}
