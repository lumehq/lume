export function Hashtag({ tag }: { tag: string }) {
	return (
		<button
			type="button"
			className="break-all cursor-default leading-normal group text-start"
		>
			<span className="text-blue-500">#</span>
			<span className="underline-offset-1 underline decoration-2 decoration-blue-200 dark:decoration-blue-800 group-hover:decoration-blue-500">
				{tag.replace("#", "")}
			</span>
		</button>
	);
}
