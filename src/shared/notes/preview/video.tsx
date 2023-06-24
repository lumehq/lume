export function VideoPreview({ urls }: { urls: string[] }) {
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.stopPropagation()}
			className="relative mt-3 max-w-[420px] flex w-full flex-col overflow-hidden rounded-lg bg-zinc-950"
		/>
	);
}
