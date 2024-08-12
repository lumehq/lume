export function Hashtag({ tag }: { tag: string }) {
	return (
		<span className="leading-normal break-all cursor-default group text-start">
			<span className="text-blue-500">#</span>
			<span className="underline underline-offset-1 decoration-2 decoration-blue-200 dark:decoration-blue-800 group-hover:decoration-blue-500">
				{tag.replace("#", "")}
			</span>
		</span>
	);
}
