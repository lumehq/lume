import { CancelIcon } from "@shared/icons";

export function TitleBar({
	title,
	onClick = undefined,
}: { title: string; onClick?: () => void }) {
	return (
		<div
			data-tauri-drag-region
			className="group overflow-hidden h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
		>
			<div className="w-6" />
			<h3 className="text-sm font-medium text-zinc-200">{title}</h3>
			{onClick ? (
				<button
					type="button"
					onClick={onClick}
					className="inline-flex h-6 w-6 shrink items-center justify-center rounded hover:bg-zinc-900 transform translate-y-8 group-hover:translate-y-0 transition-transform ease-in-out duration-150"
				>
					<CancelIcon width={12} height={12} className="text-zinc-300" />
				</button>
			) : (
				<div className="w-6" />
			)}
		</div>
	);
}
