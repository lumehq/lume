import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function NoteRoot({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex h-min w-full flex-col overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-950",
				className,
			)}
			contentEditable={false}
		>
			{children}
		</div>
	);
}
