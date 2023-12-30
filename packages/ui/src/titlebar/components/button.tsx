import { cn } from "@lume/utils";
import type { ButtonHTMLAttributes } from "react";

export function WindowButton({
	className,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			className={cn(
				"inline-flex cursor-default items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
