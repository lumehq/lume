import { SVGProps } from 'react';

export function ZapIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M4.116 12.276l4.5-9A.5.5 0 019.063 3h8.058a.5.5 0 01.429.757l-2.091 3.486a.5.5 0 00.428.757h4.804a.5.5 0 01.332.873L7.381 21.023c-.38.34-.965-.042-.808-.527l2.219-6.842A.5.5 0 008.316 13H4.563a.5.5 0 01-.447-.724z"
      ></path>
    </svg>
  );
}
