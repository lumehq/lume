export default function SidebarToggleIcon({
  className,
}: {
  className: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      <path
        d="M7.5 3.75v12.5m-4.063 0h13.126c.517 0 .937-.42.937-.938V4.688a.938.938 0 0 0-.938-.938H3.438a.938.938 0 0 0-.937.938v10.625c0 .517.42.937.938.937Z"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
