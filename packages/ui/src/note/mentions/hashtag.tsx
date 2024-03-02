export function Hashtag({ tag }: { tag: string }) {
	return (
		<button
			type="button"
			className="text-blue-500 break-all cursor-default hover:text-blue-600"
		>
			{tag}
		</button>
	);
}
