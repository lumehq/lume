import { SVGProps } from 'react';

export function SignalIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M5.46 5.46A9.221 9.221 0 002.75 12a9.221 9.221 0 002.71 6.541M8.365 8.367a5.123 5.123 0 00-1.505 3.634c0 1.419.575 2.704 1.505 3.633m7.268 0a5.122 5.122 0 001.505-3.633c0-1.42-.575-2.704-1.505-3.634m2.907 10.174a9.22 9.22 0 002.709-6.54 9.22 9.22 0 00-2.71-6.541M12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}
