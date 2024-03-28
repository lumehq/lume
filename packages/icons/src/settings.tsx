import { SVGProps } from "react";

export function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
        d="M11.002 3.325a2 2 0 0 1 1.996 0l6.25 3.598a2 2 0 0 1 1.002 1.733v6.688a2 2 0 0 1-1.002 1.733l-6.25 3.598a2 2 0 0 1-1.996 0l-6.25-3.598a2 2 0 0 1-1.002-1.733V8.656a2 2 0 0 1 1.002-1.733l6.25-3.598Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
        d="M15.25 12a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
      />
    </svg>
  );
}
