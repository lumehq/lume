import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { ReactNode } from "react";

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
				"flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900",
				className,
			)}
		>
			{withDrag ? (
				<div
					data-tauri-drag-region
					className="flex h-11 w-full shrink-0 items-center justify-end pr-2"
				>
					{withNavigate ? (
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => window.history.back()}
								className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
							>
								<ArrowLeftIcon className="size-5" />
							</button>
							<button
								type="button"
								onClick={() => window.history.forward()}
								className="inline-flex size-8 items-center justify-center rounded-full text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800"
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
