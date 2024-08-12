import { cn } from "@/commons";
import type { ReactNode } from "react";

export function Box({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className="flex h-full min-h-0 w-full">
			<div className="h-full w-full flex-1 px-2 pb-2">
				<div
					className={cn(
						"h-full w-full overflow-y-auto rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] sm:px-0 dark:bg-white/5 dark:shadow-none",
						className,
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
