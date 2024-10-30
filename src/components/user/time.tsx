import { cn, createdAt } from "@/commons";
import { useMemo } from "react";

export function UserTime({
	time,
	className,
}: {
	time: number;
	className?: string;
}) {
	const displayCreatedAt = useMemo(() => createdAt(time), [time]);

	return (
		<div className={cn("text-neutral-600 dark:text-neutral-400", className)}>
			{displayCreatedAt}
		</div>
	);
}
