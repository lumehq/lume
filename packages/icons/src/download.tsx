import { SVGProps } from "react";

export function DownloadIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M20.25 14.75v3.5a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2v-3.5M12 15V3.75M12 15l-3.5-3.5M12 15l3.5-3.5"
      />
    </svg>
  );
}
