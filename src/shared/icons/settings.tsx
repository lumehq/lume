import { SVGProps } from 'react';

export function SettingsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M8.552 5.37l-1.793-.414a1 1 0 00-.932.267l-.604.604a1 1 0 00-.267.932l.414 1.793a1 1 0 01-.42 1.056l-1.755 1.17a1 1 0 00-.445.832v.78a1 1 0 00.445.832l1.755 1.17a1 1 0 01.42 1.056l-.414 1.793a1 1 0 00.267.932l.604.604a1 1 0 00.932.267l1.793-.414a1 1 0 011.056.42l1.17 1.755a1 1 0 00.832.445h.78a1 1 0 00.832-.445l1.17-1.755a1 1 0 011.056-.42l1.793.414a1 1 0 00.932-.267l.604-.604a1 1 0 00.267-.932l-.414-1.793a1 1 0 01.42-1.056l1.755-1.17a1 1 0 00.445-.832v-.78a1 1 0 00-.445-.832l-1.755-1.17a1 1 0 01-.42-1.056l.414-1.793a1 1 0 00-.267-.932l-.604-.604a1 1 0 00-.932-.267l-1.793.414a1 1 0 01-1.056-.42l-1.17-1.755a1 1 0 00-.832-.445h-.78a1 1 0 00-.832.445L9.608 4.95a1 1 0 01-1.056.42z"
      />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 12a2.75 2.75 0 11-5.5 0 2.75 2.75 0 015.5 0z"
      />
    </svg>
  );
}
