import { cn } from "@/commons";
import { useRouteContext } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Frame({
	children,
	shadow,
	className,
}: { children: ReactNode; shadow?: boolean; className?: string }) {
	const { platform } = useRouteContext({ strict: false });

	return (
		<div
			className={cn(
				className,
				platform === "linux"
					? "bg-white dark:bg-neutral-950"
					: "bg-white dark:bg-white/10",
				shadow
					? "shadow-lg shadow-neutral-500/10 dark:shadow-none dark:ring-1 dark:ring-white/20"
					: "",
			)}
		>
			{children}
		</div>
	);
}
