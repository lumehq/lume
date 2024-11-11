import { type Settings, commands } from "@/commands.gen";
import { Spinner } from "@/components";
import * as Switch from "@radix-ui/react-switch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useState,
	useTransition,
} from "react";
import { settingsQueryOptions } from "../__root";

type Theme = "auto" | "light" | "dark";

export const Route = createLazyFileRoute("/settings/general")({
	component: Screen,
});

function Screen() {
	const settings = useSuspenseQuery(settingsQueryOptions);
	const { queryClient } = Route.useRouteContext();

	const [theme, setTheme] = useState<Theme>("auto");
	const [newSettings, setNewSettings] = useState<Settings>();
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
			const res = await commands.setAppSettings(JSON.stringify(newSettings));

			if (res.status === "ok") {
				await queryClient.invalidateQueries({ queryKey: ["settings"] });
				return;
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	useEffect(() => {
		invoke("plugin:theme|get_theme").then((data) => setTheme(data as Theme));
	}, []);

	useEffect(() => {
		if (settings.status === "success") {
			setNewSettings(settings.data);
		}
	}, [settings]);

	if (!newSettings) {
		return null;
	}

	return (
		<div className="relative w-full">
			<div className="flex flex-col gap-6 px-3 pb-3">
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold">General</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<Setting
							name="Content Warning"
							description="Shows a warning for notes that have a content warning."
							label="content_warning"
							checked={newSettings.content_warning}
							setNewSettings={setNewSettings}
						/>
						{/*
						<Setting
							name="Trusted Only"
							description="Only shows note's replies from your inner circle."
							label="trusted_only"
							newSettings={newSettings}
							setNewSettings={setNewSettings}
						/>
						*/}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold">Appearance</h2>
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
							name="Show Avatar"
							description="Shows the user avatar."
							label="display_avatar"
							checked={newSettings.display_avatar}
							setNewSettings={setNewSettings}
						/>
						<Setting
							name="Show Zap Button"
							description="Shows the Zap button when viewing a note."
							label="display_zap_button"
							checked={newSettings.display_zap_button}
							setNewSettings={setNewSettings}
						/>
						<Setting
							name="Show Repost Button"
							description="Shows the Repost button when viewing a note."
							label="display_repost_button"
							checked={newSettings.display_repost_button}
							setNewSettings={setNewSettings}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold">Privacy & Performance</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<Setting
							name="Resize Service"
							description="Use weserv for resize image on-the-fly."
							label="resize_service"
							checked={newSettings.resize_service}
							setNewSettings={setNewSettings}
						/>
						<Setting
							name="Show Remote Media"
							description="Automatically load remote media."
							label="display_media"
							checked={newSettings.display_media}
							setNewSettings={setNewSettings}
						/>
					</div>
				</div>
			</div>
			<div className="w-full h-16 flex items-center justify-end px-3">
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
	checked,
	setNewSettings,
}: {
	label: string;
	name: string;
	description: string;
	checked: boolean;
	setNewSettings: Dispatch<SetStateAction<Settings | undefined>>;
}) {
	const toggle = useCallback(() => {
		setNewSettings((state) => {
			if (state) {
				return {
					...state,
					[label]: !state[label],
				};
			}
		});
	}, []);

	return (
		<div className="flex items-start justify-between w-full gap-4 py-3">
			<div className="flex-1">
				<h3 className="text-sm font-medium">{name}</h3>
				<p className="text-xs text-neutral-700 dark:text-neutral-300">
					{description}
				</p>
			</div>
			<div className="flex justify-end w-36 shrink-0">
				<Switch.Root
					checked={checked}
					onClick={() => toggle()}
					className="relative h-7 w-12 shrink-0 cursor-default rounded-full bg-black/10 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/10"
				>
					<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
				</Switch.Root>
			</div>
		</div>
	);
}
