import { HTMLProps, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { WindowButton } from "../components/button";
import { WindowIcons } from "../components/icons";
import { AppWindowContext } from "../context";

export function Gnome({ className, ...props }: HTMLProps<HTMLDivElement>) {
	const { isWindowMaximized, minimizeWindow, maximizeWindow, closeWindow } =
		useContext(AppWindowContext);

	return (
		<div
			className={twMerge(
				"mr-[10px] h-auto items-center space-x-[13px]",
				className,
			)}
			{...props}
		>
			<WindowButton
				onClick={minimizeWindow}
				className="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
			>
				<WindowIcons.minimizeWin className="h-[9px] w-[9px]" />
			</WindowButton>
			<WindowButton
				onClick={maximizeWindow}
				className="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
			>
				{!isWindowMaximized ? (
					<WindowIcons.maximizeWin className="h-2 w-2" />
				) : (
					<WindowIcons.maximizeRestoreWin className="h-[9px] w-[9px]" />
				)}
			</WindowButton>
			<WindowButton
				onClick={closeWindow}
				className="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
			>
				<WindowIcons.closeWin className="h-2 w-2" />
			</WindowButton>
		</div>
	);
}
