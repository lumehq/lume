import { RefreshIcon } from "@shared/icons";
import { getVersion } from "@tauri-apps/api/app";

const appVersion = await getVersion();

export function VersionSetting() {
	return (
		<div className="px-5 py-4 inline-flex items-center justify-between">
			<div className="flex flex-col gap-1">
				<span className="leading-none font-medium text-zinc-200">Version</span>
				<span className="leading-none text-sm text-zinc-400">
					You're using latest version
				</span>
			</div>
			<div className="inline-flex items-center gap-2">
				<span className="text-zinc-300 font-medium">{appVersion}</span>
				<button
					type="button"
					className="w-8 h-8 inline-flex items-center justify-center font-medium bg-zinc-800 hover:bg-fuchsia-500 rounded-md"
				>
					<RefreshIcon className="w-4 h-4 text-zinc-100" />
				</button>
			</div>
		</div>
	);
}
