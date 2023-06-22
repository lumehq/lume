import { ArrowLeftIcon, ArrowRightIcon } from "@shared/icons";

export function AppHeader({ reverse }: { reverse?: boolean }) {
	const goBack = () => {
		window.history.back();
	};

	const goForward = () => {
		window.history.forward();
	};

	return (
		<div
			data-tauri-drag-region
			className={`shrink-0 flex h-11 w-full px-3 border-b border-zinc-900 items-center ${
				reverse ? "justify-start" : "justify-end"
			}`}
		>
			<div className="flex gap-2.5">
				<button
					type="button"
					onClick={() => goBack()}
					className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowLeftIcon
						width={16}
						height={16}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
				<button
					type="button"
					onClick={() => goForward()}
					className="group inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-900"
				>
					<ArrowRightIcon
						width={16}
						height={16}
						className="text-zinc-500 group-hover:text-zinc-300"
					/>
				</button>
			</div>
		</div>
	);
}
