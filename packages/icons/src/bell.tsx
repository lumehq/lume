import { SVGProps } from "react";

export function BellIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 18c-.673 1.766-2.21 3-4 3s-3.327-1.234-4-3m-1.716 0h11.432a2 2 0 0 0 1.982-2.264l-.905-6.789a6.853 6.853 0 0 0-13.586 0l-.905 6.789A2 2 0 0 0 6.284 18Z"
      />
    </svg>
  );
}
