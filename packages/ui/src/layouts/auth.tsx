import { SettingsIcon } from "@lume/icons";
import { type Platform } from "@tauri-apps/plugin-os";
import { Outlet } from "react-router-dom";
import { WindowTitleBar } from "../titlebar";

export function AuthLayout({ platform }: { platform: Platform }) {
	return (
		<div className="flex flex-col w-screen h-screen bg-black">
			{platform !== "macos" ? (
				<WindowTitleBar platform={platform} />
			) : (
				<div data-tauri-drag-region className="h-9 shrink-0" />
			)}
			<div className="relative w-full h-full">
				<div className="absolute top-0 right-9">
					<div className="inline-flex items-center justify-center rounded-lg size-10 bg-neutral-950 group hover:bg-neutral-900">
						<SettingsIcon className="size-6 text-neutral-700 group-hover:text-neutral-500" />
					</div>
				</div>
				<Outlet />
			</div>
		</div>
	);
}
