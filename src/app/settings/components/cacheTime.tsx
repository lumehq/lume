import { getSetting, updateSetting } from "@libs/storage";
import { CheckCircleIcon } from "@shared/icons";
import { useState } from "react";

const setting = await getSetting("cache_time");
const cacheTime = setting;

export function CacheTimeSetting() {
	const [time, setTime] = useState(cacheTime);

	const update = async () => {
		await updateSetting("cache_time", time);
	};

	return (
		<div className="px-5 py-4 inline-flex items-center justify-between">
			<div className="flex flex-col gap-1">
				<span className="leading-none font-medium text-zinc-200">
					Cache time
				</span>
				<span className="leading-none text-sm text-zinc-400">
					The length of time before inactive data gets removed from the cache
				</span>
			</div>
			<div className="inline-flex items-center gap-2">
				<input
					value={time}
					onChange={(e) => setTime(e.currentTarget.value)}
					autoCapitalize="none"
					autoCorrect="none"
					className="w-24 h-8 rounded-md px-2 bg-zinc-800 text-zinc-300 text-right font-medium focus:outline-none"
				/>
				<button
					type="button"
					onClick={() => update()}
					className="w-8 h-8 inline-flex items-center justify-center font-medium bg-zinc-800 hover:bg-fuchsia-500 rounded-md"
				>
					<CheckCircleIcon className="w-4 h-4 text-zinc-100" />
				</button>
			</div>
		</div>
	);
}
