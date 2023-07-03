import { Switch } from "@headlessui/react";
import { getSetting, updateSetting } from "@libs/storage";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { disable, enable, isEnabled } from "tauri-plugin-autostart-api";

export function AutoStartSetting() {
	const [enabled, setEnabled] = useState(false);

	const toggle = async () => {
		if (!enabled) {
			await enable();
			await updateSetting("auto_start", 1);
			console.log(`registered for autostart? ${await isEnabled()}`);
		} else {
			await disable();
			await updateSetting("auto_start", 0);
		}
		setEnabled(!enabled);
	};

	useEffect(() => {
		async function getAppSetting() {
			const setting = await getSetting("auto_start");
			if (parseInt(setting) === 0) {
				setEnabled(false);
			} else {
				setEnabled(true);
			}
		}
		getAppSetting();
	}, []);

	return (
		<div className="px-5 py-4 inline-flex items-center justify-between">
			<div className="flex flex-col gap-1">
				<span className="leading-none font-medium text-zinc-200">
					Auto start
				</span>
				<span className="leading-none text-sm text-zinc-400">
					Auto start at login
				</span>
			</div>
			<Switch
				checked={enabled}
				onChange={toggle}
				className={twMerge(
					"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2",
					enabled ? "bg-fuchsia-500" : "bg-zinc-700",
				)}
			>
				<span
					className={twMerge(
						"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out",
						enabled ? "translate-x-5" : "translate-x-0",
					)}
				/>
			</Switch>
		</div>
	);
}
