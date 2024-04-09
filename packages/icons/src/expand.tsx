import { SVGProps } from "react";

export function ExpandIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 12.75v3.5a2 2 0 0 0 2 2h3.5m1.5-12.5h3.5a2 2 0 0 1 2 2v3.5"
      />
    </svg>
  );
}
