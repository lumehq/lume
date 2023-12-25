import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function WindowButton({
	className,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			className={twMerge(
				"inline-flex cursor-default items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
