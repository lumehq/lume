import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function NoteRoot({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={twMerge(
				"flex h-min w-full flex-col overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-950",
				className,
			)}
		>
			{children}
		</div>
	);
}
