import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import type { ReactNode } from "react";

export function Container({
	children,
	withDrag = false,
	withNavigate = true,
	className,
}: {
	children: ReactNode;
	withDrag?: boolean;
	withNavigate?: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-transparent flex h-screen w-screen flex-col",
				className,
			)}
		>
			{withDrag ? (
				<div
					data-tauri-drag-region
					className="bg-transparent flex h-11 w-full shrink-0 items-center justify-end pr-2"
				>
					{withNavigate ? (
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => window.history.back()}
								className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
							>
								<ArrowLeftIcon className="size-5" />
							</button>
							<button
								type="button"
								onClick={() => window.history.forward()}
								className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
							>
								<ArrowRightIcon className="size-5" />
							</button>
						</div>
					) : null}
				</div>
			) : null}
			{children}
		</div>
	);
}
