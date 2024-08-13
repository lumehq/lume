import { cn } from "@/commons";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function GoBack({
	children,
	className,
}: { children: ReactNode | ReactNode[]; className?: string }) {
	const { history } = useRouter();

	return (
		<button
			type="button"
			onClick={() => history.go(-1)}
			className={cn(className)}
		>
			{children}
		</button>
	);
}
