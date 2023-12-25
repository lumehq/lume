import { HTMLProps, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { WindowButton } from "../components/button";
import { WindowIcons } from "../components/icons";
import { AppWindowContext } from "../context";

export function Windows({ className, ...props }: HTMLProps<HTMLDivElement>) {
	const { isWindowMaximized, minimizeWindow, maximizeWindow, closeWindow } =
		useContext(AppWindowContext);

	return (
		<div className={twMerge("h-8", className)} {...props}>
			<WindowButton
				onClick={minimizeWindow}
				className="max-h-8 w-[46px] cursor-default rounded-none bg-transparent text-black/90 hover:bg-black/[.05] active:bg-black/[.03]  dark:text-white dark:hover:bg-white/[.06] dark:active:bg-white/[.04]"
			>
				<WindowIcons.minimizeWin />
			</WindowButton>
			<WindowButton
				onClick={maximizeWindow}
				className={twMerge(
					"max-h-8 w-[46px] cursor-default rounded-none bg-transparent",
					"text-black/90 hover:bg-black/[.05] active:bg-black/[.03] dark:text-white dark:hover:bg-white/[.06] dark:active:bg-white/[.04]",
					// !isMaximizable && "text-white/[.36]",
				)}
			>
				{!isWindowMaximized ? (
					<WindowIcons.maximizeWin />
				) : (
					<WindowIcons.maximizeRestoreWin />
				)}
			</WindowButton>
			<WindowButton
				onClick={closeWindow}
				className="max-h-8 w-[46px] cursor-default rounded-none bg-transparent text-black/90 hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/90 dark:text-white"
			>
				<WindowIcons.closeWin />
			</WindowButton>
		</div>
	);
}
