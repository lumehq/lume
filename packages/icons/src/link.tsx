import { SVGProps } from "react";

export function LinkIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
        d="M20.5 13.5c0 1.395 0 2.092-.138 2.667a5 5 0 01-3.695 3.695C16.092 20 15.394 20 14 20h-1.5c-2.8 0-4.2 0-5.27-.545a5 5 0 01-2.185-2.185C4.5 16.2 4.5 14.8 4.5 12v-.5c0-2.33 0-3.495.38-4.413A5 5 0 017.588 4.38C8.363 4.059 9.317 4.009 11 4m9.26 5.454c.262-1.633.31-3.285.142-4.914a.495.495 0 00-.142-.3m0 0a.496.496 0 00-.301-.143 18.815 18.815 0 00-4.913.142m5.214 0L10.5 14"
      ></path>
    </svg>
  );
}
