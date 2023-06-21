import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Button({
	preset,
	children,
	disabled = false,
	onClick = undefined,
}: {
	preset: "small" | "publish" | "large";
	children: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
}) {
	let preClass: string;
	switch (preset) {
		case "small":
			preClass =
				"w-min h-9 px-4 bg-fuchsia-500 rounded-md text-sm font-medium text-zinc-100 hover:bg-fuchsia-600";
			break;
		case "publish":
			preClass =
				"w-min h-9 px-4 bg-fuchsia-500 rounded-md text-sm font-medium text-zinc-100 hover:bg-fuchsia-600";
			break;
		case "large":
			preClass =
				"h-11 w-full bg-fuchsia-500 rounded-md font-medium text-zinc-100 hover:bg-fuchsia-600";
			break;
		default:
			break;
	}

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={twMerge(
				"inline-flex items-center justify-center gap-1 transform active:translate-y-1 disabled:pointer-events-none disabled:opacity-50 focus:outline-none",
				preClass,
			)}
		>
			{children}
		</button>
	);
}
