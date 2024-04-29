import type { Settings } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import {
	isPermissionGranted,
	requestPermission,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { useDebouncedCallback } from "use-debounce";

export const Route = createFileRoute("/settings/general")({
	beforeLoad: async ({ context }) => {
		const permissionGranted = await isPermissionGranted(); // get notification permission
		const ark = context.ark;
		const settings = await ark.get_settings();

		return {
			settings: { ...settings, notification: permissionGranted },
		};
	},
	component: Screen,
});

function Screen() {
	const { ark, settings } = Route.useRouteContext();
	const [newSettings, setNewSettings] = useState<Settings>(settings);

	const toggleNofitication = async () => {
		await requestPermission();
		setNewSettings((prev) => ({
			...prev,
			notification: !newSettings.notification,
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

	const toggleZap = () => {
		setNewSettings((prev) => ({
			...prev,
			zap: !newSettings.zap,
		}));
	};

	const toggleNsfw = () => {
		setNewSettings((prev) => ({
			...prev,
			nsfw: !newSettings.nsfw,
		}));
	};

	const updateSettings = useDebouncedCallback(() => {
		ark.set_settings(newSettings);
	}, 200);

	useEffect(() => {
		updateSettings();
	}, [newSettings]);

	return (
		<div className="mx-auto w-full max-w-xl">
			<div className="flex flex-col gap-3 divide-y divide-neutral-300 dark:divide-neutral-700">
				<div className="flex flex-col">
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
						<Switch.Root
							checked={newSettings.notification}
							onClick={() => toggleNofitication()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div className="flex-1">
							<h3 className="font-semibold">Push Notification</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Enabling push notifications will allow you to receive
								notifications from Lume.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
						<Switch.Root
							checked={newSettings.enhancedPrivacy}
							onClick={() => toggleEnhancedPrivacy()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div className="flex-1">
							<h3 className="font-semibold">Enhanced Privacy</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Lume will display external resources like image, video or link
								preview as plain text.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
						<Switch.Root
							checked={newSettings.autoUpdate}
							onClick={() => toggleAutoUpdate()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div className="flex-1">
							<h3 className="font-semibold">Auto Update</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Automatically download and install new version.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
						<Switch.Root
							checked={newSettings.zap}
							onClick={() => toggleZap()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div className="flex-1">
							<h3 className="font-semibold">Zap</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Show the Zap button in each note and user's profile screen, use
								for send Bitcoin tip to other users.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-neutral-900">
						<Switch.Root
							checked={newSettings.nsfw}
							onClick={() => toggleNsfw()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div className="flex-1">
							<h3 className="font-semibold">Filter sensitive content</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								By default, Lume will display all content which have Content
								Warning tag, it's may include NSFW content.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
