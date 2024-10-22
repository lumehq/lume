import { cn } from "@/commons";
import type { ReactNode } from "react";

export function Frame({
	children,
	shadow,
	className,
}: { children: ReactNode; shadow?: boolean; className?: string }) {
	return (
		<div
			className={cn(
				className,
				"bg-white dark:bg-neutral-800",
				shadow
					? "shadow-primary dark:shadow-none dark:ring-1 dark:ring-neutral-700/50"
					: "",
			)}
		>
			{children}
		</div>
	);
}
