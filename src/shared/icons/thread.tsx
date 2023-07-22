import { SVGProps } from 'react';

export function ThreadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        fill="currentColor"
        d="M12 19.25V20a.75.75 0 00.75-.75H12zm8.5-9a.75.75 0 001.5 0h-1.5zm-.75 3.5a.75.75 0 00-1.5 0h1.5zm-1.5 6.5a.75.75 0 001.5 0h-1.5zm-2.5-4a.75.75 0 000 1.5v-1.5zm6.5 1.5a.75.75 0 000-1.5v1.5zm-18.75.5V5.75H2v12.5h1.5zm8.5.25H3.75V20H12v-1.5zm8.5-12.75v4.5H22v-4.5h-1.5zM3.75 5.5H12V4H3.75v1.5zm8.25 0h8.25V4H12v1.5zm.75 13.75V4.75h-1.5v14.5h1.5zm5.5-5.5V17h1.5v-3.25h-1.5zm0 3.25v3.25h1.5V17h-1.5zm-2.5.75H19v-1.5h-3.25v1.5zm3.25 0h3.25v-1.5H19v1.5zm3-12A1.75 1.75 0 0020.25 4v1.5a.25.25 0 01.25.25H22zm-18.5 0a.25.25 0 01.25-.25V4A1.75 1.75 0 002 5.75h1.5zM2 18.25c0 .966.784 1.75 1.75 1.75v-1.5a.25.25 0 01-.25-.25H2z"
      ></path>
    </svg>
  );
}
