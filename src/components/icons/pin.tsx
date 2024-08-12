export function PinIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<path d="M12 21v-5.307m0 0c-2.201 0-4.39-.184-6.567-.495a.504.504 0 01-.433-.5 4.54 4.54 0 012.194-3.886c.63-.381 1.034-1.029.85-1.788l-.986-4.092a1.6 1.6 0 011.406-1.967c2.366-.22 4.706-.22 7.072 0a1.6 1.6 0 011.406 1.967l-.986 4.092c-.183.76.22 1.407.85 1.788A4.54 4.54 0 0119 14.698a.504.504 0 01-.433.5c-2.178.31-4.366.495-6.567.495z" />
		</svg>
	);
}
