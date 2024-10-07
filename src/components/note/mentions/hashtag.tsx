export function Hashtag({ tag }: { tag: string }) {
	return (
		<span className="leading-normal cursor-default text-blue-500 hover:text-blue-600 font-normal">
			{tag}
		</span>
	);
}
