import { NostrQuery, type Settings } from "@lume/system";
import * as Switch from "@radix-ui/react-switch";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Theme = "auto" | "light" | "dark";

export const Route = createFileRoute("/settings/general")({
	beforeLoad: async () => {
		const initialSettings = await NostrQuery.getUserSettings();
		return { initialSettings };
	},
	component: Screen,
});

function Screen() {
	const { initialSettings } = Route.useRouteContext();

	const [theme, setTheme] = useState<Theme>(null);
	const [settings, setSettings] = useState<Settings>(null);

	const changeTheme = async (theme: string) => {
		if (theme === "auto" || theme === "light" || theme === "dark") {
			invoke("plugin:theme|set_theme", {
				theme: theme,
			}).then(() => setTheme(theme));
		}
	};

	const updateSettings = useDebouncedCallback(async () => {
		const newSettings = JSON.stringify(settings);
		await NostrQuery.setUserSettings(newSettings);
	}, 200);

	useEffect(() => {
		updateSettings();
	}, [settings]);

	useEffect(() => {
		invoke("plugin:theme|get_theme").then((data: Theme) => setTheme(data));
	}, []);

	useEffect(() => {
		setSettings(initialSettings);
	}, [initialSettings]);

	if (!settings) return null;

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col gap-6">
				<div className="flex items-center w-full px-3 text-sm rounded-lg h-11 bg-black/5 dark:bg-white/5">
					* Setting changes require restarting the app to take effect.
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						General
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Relay Hint</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Use the relay hint if necessary.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.use_relay_hint}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											use_relay_hint: !prev.use_relay_hint,
										}))
									}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Content Warning</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Shows a warning for notes that have a content warning.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.content_warning}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											content_warning: !prev.content_warning,
										}))
									}
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
						Appearance
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Appearance</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Require restarting the app to take effect.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<select
									name="theme"
									className="w-24 py-1 bg-transparent rounded-lg shadow-none outline-none border-1 border-black/10 dark:border-white/10"
									defaultValue={theme}
									onChange={(e) => changeTheme(e.target.value)}
								>
									<option value="auto">Auto</option>
									<option value="light">Light</option>
									<option value="dark">Dark</option>
								</select>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Vibrancy Effect</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Make the window transparent.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.vibrancy}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											vibrancy: !prev.vibrancy,
										}))
									}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Zap Button</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Shows the Zap button when viewing a note.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.display_zap_button}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											display_zap_button: !prev.display_zap_button,
										}))
									}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Repost Button</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Shows the Repost button when viewing a note.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.display_zap_button}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											display_zap_button: !prev.display_zap_button,
										}))
									}
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
						Privacy & Performance
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Proxy</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Set proxy address.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<input
									type="url"
									defaultValue={settings.proxy}
									onChange={(e) =>
										setSettings((prev) => ({
											...prev,
											proxy: e.target.value,
										}))
									}
									className="py-1 bg-transparent rounded-lg shadow-none outline-none w-44 border-1 border-black/10 dark:border-white/10"
								/>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Image Resize Service</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									Use weserv/images for resize image on-the-fly.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<input
									type="url"
									defaultValue={settings.image_resize_service}
									onChange={(e) =>
										setSettings((prev) => ({
											...prev,
											image_resize_service: e.target.value,
										}))
									}
									className="py-1 bg-transparent rounded-lg shadow-none outline-none w-44 border-1 border-black/10 dark:border-white/10"
								/>
							</div>
						</div>
						<div className="flex items-start justify-between w-full gap-4 py-3">
							<div className="flex-1">
								<h3 className="font-medium">Load Remote Media</h3>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									View the remote media directly.
								</p>
							</div>
							<div className="flex justify-end w-36 shrink-0">
								<Switch.Root
									checked={settings.display_media}
									onClick={() =>
										setSettings((prev) => ({
											...prev,
											display_image_link: !prev.display_media,
										}))
									}
									className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
								>
									<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
								</Switch.Root>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
