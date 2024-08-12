import { cn } from "@/commons";
import type { ReactNode } from "react";

export function UserRoot({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn(className)}>{children}</div>;
}
