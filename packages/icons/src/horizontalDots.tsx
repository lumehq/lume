export function HorizontalDotsIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8.25 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-16.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8.25 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-16.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  );
}
