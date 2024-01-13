import { ArrowLeftIcon, SettingsIcon } from "@lume/icons";
import { type Platform } from "@tauri-apps/plugin-os";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { WindowTitleBar } from "../titlebar";

export function AuthLayout({ platform }: { platform: Platform }) {
	const location = useLocation();
	const navigate = useNavigate();

	const canGoBack = location.pathname.length > 6;

	return (
		<div className="flex flex-col w-screen h-screen bg-black text-neutral-50">
			{platform === "windows" ? (
				<WindowTitleBar platform={platform} />
			) : (
				<div data-tauri-drag-region className="h-9 shrink-0" />
			)}
			<div className="relative w-full h-full">
				<div className="absolute top-0 z-10 flex items-center justify-between w-full px-9">
					{canGoBack ? (
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="inline-flex items-center justify-center rounded-lg size-10 group"
						>
							<ArrowLeftIcon className="size-6 text-neutral-700 group-hover:text-neutral-500" />
						</button>
					) : (
						<div />
					)}
					<div className="inline-flex items-center justify-center rounded-lg size-10 bg-neutral-950 group hover:bg-neutral-900">
						<SettingsIcon className="size-6 text-neutral-700 group-hover:text-neutral-500" />
					</div>
				</div>
				<Outlet />
			</div>
		</div>
	);
}
