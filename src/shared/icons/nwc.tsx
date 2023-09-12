import { SVGProps } from 'react';

export function NwcIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
        fillRule="evenodd"
        d="M3 6.5A3.5 3.5 0 016.5 3h8.969C16.314 3 17 3.686 17 4.531V8h2.25c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0119.25 21h-7a.75.75 0 010-1.5h7a.25.25 0 00.25-.25v-9.5a.25.25 0 00-.25-.25H6a2.986 2.986 0 01-1.5-.401v2.151a.75.75 0 01-1.5 0V6.5zm1.5 0A1.5 1.5 0 006 8h9.5V4.531a.031.031 0 00-.031-.031H6.5a2 2 0 00-2 2zm-1 9.285v2.93L6 20.173l2.5-1.458v-2.93L6 14.327l-2.5 1.458zm2.122-2.975a.75.75 0 01.756 0l3.25 1.896a.75.75 0 01.372.648v3.792a.75.75 0 01-.372.648l-3.25 1.895a.75.75 0 01-.756 0l-3.25-1.895A.75.75 0 012 19.146v-3.792a.75.75 0 01.372-.648l3.25-1.896z"
        clipRule="evenodd"
      ></path>
      <path fill="currentColor" d="M15.5 15.5a1 1 0 100-2 1 1 0 000 2z"></path>
    </svg>
  );
}
