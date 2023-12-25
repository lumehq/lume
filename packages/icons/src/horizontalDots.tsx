export function HorizontalDotsIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M6 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      <path d="M13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      <path d="M20 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
  );
}
