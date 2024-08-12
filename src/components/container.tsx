import { cn } from "@/commons";
import type { ReactNode } from "react";

export function Container({
	children,
	withDrag = false,
	className,
}: {
	children: ReactNode;
	withDrag?: boolean;
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
					className="bg-transparent flex h-11 w-full shrink-0"
				/>
			) : null}
			{children}
		</div>
	);
}
