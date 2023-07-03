import { AutoStartSetting } from "@app/settings/components/autoStart";
import { CacheTimeSetting } from "@app/settings/components/cacheTime";
import { VersionSetting } from "@app/settings/components/version";

export function GeneralSettingsScreen() {
	return (
		<div className="w-full h-full px-3 pt-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-lg font-semibold text-zinc-100">General</h1>
				<div className="w-full bg-zinc-900 border-t border-zinc-800/50 rounded-xl">
					<div className="w-full h-full flex flex-col divide-y divide-zinc-800">
						<AutoStartSetting />
						<CacheTimeSetting />
						<VersionSetting />
					</div>
				</div>
			</div>
		</div>
	);
}
