import { SVGProps } from "react";

export function LinkIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 6H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 7.52 4 8.08 4 9.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.52 20 6.08 20 7.2 20h7.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C18 18.48 18 17.92 18 16.8V15M14 4h6m0 0v6m0-6-9 9"
      />
    </svg>
  );
}
