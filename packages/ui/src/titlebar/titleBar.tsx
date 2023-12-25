import { Platform } from "@tauri-apps/plugin-os";
import { AppWindowProvider } from "./context";
import { Gnome } from "./controls/gnome";
import { MacOS } from "./controls/macos";
import { Windows } from "./controls/windows";

export function WindowTitleBar({ platform }: { platform: Platform }) {
	const ControlsComponent = () => {
		switch (platform) {
			case "windows":
				return <Windows className="ml-auto flex" />;
			case "macos":
				return <MacOS className="ml-0 flex" />;
			case "linux":
				return <Gnome className="ml-auto flex" />;
			default:
				return <Windows className="ml-auto flex" />;
		}
	};

	return (
		<AppWindowProvider>
			<div
				data-tauri-drag-region
				className="bg-background flex select-none flex-row overflow-hidden"
			>
				<ControlsComponent />
			</div>
		</AppWindowProvider>
	);
}
