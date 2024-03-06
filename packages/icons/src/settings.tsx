import { SVGProps } from "react";

export function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.02 3.552a2 2 0 0 1 1.96 0l6 3.374A2 2 0 0 1 20 8.67v6.66a2 2 0 0 1-1.02 1.743l-6 3.375a2 2 0 0 1-1.96 0l-6-3.374A2 2 0 0 1 4 15.33V8.67a2 2 0 0 1 1.02-1.744l6-3.374Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}
