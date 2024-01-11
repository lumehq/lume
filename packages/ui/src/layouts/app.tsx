import { type Platform } from "@tauri-apps/plugin-os";
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Activity } from "../activity/column";
import { Editor } from "../editor/column";
import { Navigation } from "../navigation";
import { WindowTitleBar } from "../titlebar";

export function AppLayout({ platform }: { platform: Platform }) {
	return (
		<div
			className={twMerge(
				"flex h-screen w-screen flex-col",
				platform !== "macos" ? "bg-blue-50 dark:bg-blue-950" : "",
			)}
		>
			{platform !== "macos" ? (
				<WindowTitleBar platform={platform} />
			) : (
				<div data-tauri-drag-region className="h-9 shrink-0" />
			)}
			<div className="flex w-full h-full min-h-0">
				<Navigation />
				<Editor />
				<Activity />
				<div className="flex-1 h-full px-1 pb-1">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
