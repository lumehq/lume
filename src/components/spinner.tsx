import { cn } from "@/commons";
import type { ReactNode } from "react";

export function Spinner({
	children,
	className,
}: {
	children?: ReactNode;
	className?: string;
}) {
	const spinner = (
		<span className={cn("block relative opacity-65 size-4", className)}>
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
			<span className="spinner-leaf" />
		</span>
	);

	if (children === undefined) return spinner;

	return (
		<div className="relative flex items-center justify-center">
			<span>
				{/**
				 * `display: contents` removes the content from the accessibility tree in some browsers,
				 * so we force remove it with `aria-hidden`
				 */}
				<span
					aria-hidden
					style={{ display: "contents", visibility: "hidden" }}
					// biome-ignore lint/correctness/noConstantCondition: Workaround to use `inert` until https://github.com/facebook/react/pull/24730 is merged.
					{...{ inert: true ? "" : undefined }}
				>
					{children}
				</span>
				<div className="absolute flex items-center justify-center">
					<span>{spinner}</span>
				</div>
			</span>
		</div>
	);
}
