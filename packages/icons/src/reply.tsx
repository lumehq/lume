export function ReplyIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="24"
			fill="none"
			viewBox="0 0 25 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<path d="M9.5 12h3m0 0h3m-3 0V9m0 3v3m9-3a9 9 0 01-10.272 8.91c-1.203-.17-1.805-.255-1.964-.267-.257-.02-.165-.016-.423-.014-.159 0-.34.014-.702.04l-2.153.153c-.857.062-1.286.092-1.607-.06a1.35 1.35 0 01-.641-.641c-.152-.32-.122-.75-.06-1.607l.153-2.153c.026-.362.04-.543.04-.702.002-.258.006-.166-.014-.423-.012-.159-.098-.76-.268-1.964A9 9 0 1121.5 12z" />
		</svg>
	);
}
