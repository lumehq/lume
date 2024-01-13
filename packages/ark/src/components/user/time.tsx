import { cn, formatCreatedAt } from "@lume/utils";
import { useMemo } from "react";

export function UserTime({
	time,
	className,
}: { time: number; className?: string }) {
	const createdAt = useMemo(() => formatCreatedAt(time), [time]);

	return <div className={cn("", className)}>{createdAt}</div>;
}
