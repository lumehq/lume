import { NostrQuery } from "@lume/system";
import type { Settings } from "@lume/types";
import * as Switch from "@radix-ui/react-switch";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { requestPermission } from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const Route = createFileRoute("/settings/general")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getSettings();
		return { settings };
	},
	component: Screen,
});

function Screen() {
	const { settings } = Route.useRouteContext();
	const [newSettings, setNewSettings] = useState<Settings>(settings);

	const toggleNofitication = async () => {
		await requestPermission();
		setNewSettings((prev) => ({
			...prev,
			notification: !newSettings.notification,
		}));
	};

	const toggleGossip = async () => {
		setNewSettings((prev) => ({
			...prev,
			gossip: !newSettings.gossip,
		}));
	};

	const toggleAutoUpdate = () => {
		setNewSettings((prev) => ({
			...prev,
			autoUpdate: !newSettings.autoUpdate,
		}));
	};

	const toggleEnhancedPrivacy = () => {
		setNewSettings((prev) => ({
			...prev,
			enhancedPrivacy: !newSettings.enhancedPrivacy,
		}));
	};

	const toggleNsfw = () => {
		setNewSettings((prev) => ({
			...prev,
			nsfw: !newSettings.nsfw,
		}));
	};

	const changeTheme = (theme: string) => {
		if (theme === "auto" || theme === "light" || theme === "dark") {
			invoke("plugin:theme|set_theme", {
				theme: theme,
			}).then(() =>
				setNewSettings((prev) => ({
					...prev,
					theme,
				})),
			);
		}
	};

	const updateSettings = useDebouncedCallback(() => {
		NostrQuery.setSettings(newSettings);
	}, 200);

	useEffect(() => {
		updateSettings();
	}, [newSettings]);

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						General
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Notification</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									By turning on push notifications, you'll start getting
									notifications from Lume directly.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={newSettings.notification}
									onClick={() => toggleNofitication()}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Relay Hint</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Automatically connect to the necessary relay suggested by
									Relay Hint when fetching a new event.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={newSettings.gossip}
									onClick={() => toggleGossip()}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Enhanced Privacy</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Lume presents external resources like images, videos, or link
									previews in plain text.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={newSettings.enhancedPrivacy}
									onClick={() => toggleEnhancedPrivacy()}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Auto Update</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Automatically download and install new version.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={newSettings.autoUpdate}
									onClick={() => toggleAutoUpdate()}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-semibold">Filter sensitive content</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									By default, Lume will display all content which have Content
									Warning tag, it's may include NSFW content.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={newSettings.nsfw}
									onClick={() => toggleNsfw()}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Interface
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-semibold">Appearance</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									* Require restarting the app to take effect.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<select
									name="theme"
									className="w-24 py-1 bg-transparent rounded-lg shadow-none outline-none border-1 border-black/10 dark:border-white/10"
									defaultValue={settings.theme}
									onChange={(e) => changeTheme(e.target.value)}
								>
									<option value="auto">Auto</option>
									<option value="light">Light</option>
									<option value="dark">Dark</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
