import { commands } from "@/commands.gen";
import { appSettings } from "@/commons";
import { Spinner } from "@/components";
import * as Switch from "@radix-ui/react-switch";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useState, useTransition } from "react";

type Theme = "auto" | "light" | "dark";

export const Route = createLazyFileRoute("/$account/_settings/general")({
	component: Screen,
});

function Screen() {
	const [theme, setTheme] = useState<Theme>(null);
	const [isPending, startTransition] = useTransition();

	const changeTheme = useCallback(async (theme: string) => {
		if (theme === "auto" || theme === "light" || theme === "dark") {
			invoke("plugin:theme|set_theme", {
				theme: theme,
			}).then(() => setTheme(theme));
		}
	}, []);

	const updateSettings = () => {
		startTransition(async () => {
			const newSettings = JSON.stringify(appSettings.state);
			const res = await commands.setSettings(newSettings);

			if (res.status === "error") {
				await message(res.error, { kind: "error" });
			}

			return;
		});
	};

	useEffect(() => {
		invoke("plugin:theme|get_theme").then((data) => setTheme(data as Theme));
	}, []);

	return (
		<div className="relative w-full">
			<div className="flex flex-col gap-6 px-3 pb-3">
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						General
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<Setting
							name="Relay Hint"
							description="Use the relay hint if necessary."
							label="use_relay_hint"
						/>
						<Setting
							name="Content Warning"
							description="Shows a warning for notes that have a content warning."
							label="content_warning"
						/>
						<Setting
							name="Trusted Only"
							description="Only shows note's replies from your inner circle."
							label="trusted_only"
						/>
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
									Change app theme
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
						<Setting
							name="Transparent Effect"
							description="Use native window transparent effect."
							label="transparent"
						/>
						<Setting
							name="Show Zap Button"
							description="Shows the Zap button when viewing a note."
							label="display_zap_button"
						/>
						<Setting
							name="Show Repost Button"
							description="Shows the Repost button when viewing a note."
							label="display_repost_button"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Privacy & Performance
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<Setting
							name="Proxy"
							description="Set proxy address."
							label="proxy"
						/>
						<Setting
							name="Image Resize Service"
							description="Use weserv/images for resize image on-the-fly."
							label="image_resize_service"
						/>
						<Setting
							name="Load Remote Media"
							description="View the remote media directly."
							label="display_media"
						/>
					</div>
				</div>
			</div>
			<div className="sticky bottom-0 left-0 w-full h-16 flex items-center justify-end px-3">
				<div className="absolute left-0 bottom-0 w-full h-11 gradient-mask-t-0 bg-neutral-100 dark:bg-neutral-900" />
				<button
					type="button"
					onClick={() => updateSettings()}
					className="relative z-10 inline-flex items-center justify-center w-20 rounded-md shadow h-8 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
				>
					{isPending ? <Spinner className="size-4" /> : "Update"}
				</button>
			</div>
		</div>
	);
}

function Setting({
	label,
	name,
	description,
}: { label: string; name: string; description: string }) {
	const state = useStore(appSettings, (state) => state[label]);

	const toggle = useCallback(() => {
		appSettings.setState((state) => {
			return {
				...state,
				[label]: !state[label],
			};
		});
	}, []);

	return (
		<div className="flex items-start justify-between w-full gap-4 py-3">
			<div className="flex-1">
				<h3 className="font-medium">{name}</h3>
				<p className="text-sm text-neutral-700 dark:text-neutral-300">
					{description}
				</p>
			</div>
			<div className="flex justify-end w-36 shrink-0">
				<Switch.Root
					checked={state}
					onClick={() => toggle()}
					className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
				>
					<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
				</Switch.Root>
			</div>
		</div>
	);
}
