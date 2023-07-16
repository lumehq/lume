import { SVGProps } from 'react';

export function StrangersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        d="M17.75 19.25h3.673c.581 0 1.045-.496.947-1.07-.531-3.118-2.351-5.43-5.37-5.43-.446 0-.866.05-1.26.147M11.25 7a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0zm8.5.5a2.75 2.75 0 11-5.5 0 2.75 2.75 0 015.5 0zM1.87 19.18c.568-3.68 2.647-6.43 6.13-6.43 3.482 0 5.561 2.75 6.13 6.43.088.575-.375 1.07-.956 1.07H2.825c-.58 0-1.043-.495-.955-1.07z"
      ></path>
    </svg>
  );
}
