import { LaurelIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import { Spinner } from "@lume/ui";
import * as Switch from "@radix-ui/react-switch";
import { createFileRoute } from "@tanstack/react-router";
import { requestPermission } from "@tauri-apps/plugin-notification";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/$account/settings")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getSettings();
		return { settings };
	},
	component: Screen,
	pendingComponent: Pending,
});

function Screen() {
	const navigate = Route.useNavigate();
	const { account } = Route.useParams();
	const { settings } = Route.useRouteContext();
	const { t } = useTranslation();

	const [newSettings, setNewSettings] = useState(settings);
	const [loading, setLoading] = useState(false);

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

	const submit = async () => {
		try {
			// start loading
			setLoading(true);

			// publish settings
			const eventId = await NostrQuery.setSettings(newSettings);

			if (eventId) {
				return navigate({
					to: "/$account/home",
					params: { account },
					replace: true,
				});
			}
		} catch (e) {
			setLoading(false);
			toast.error(e);
		}
	};

	return (
		<div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-6 px-5 xl:max-w-xl">
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="flex size-20 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-950 text-teal-500">
					<LaurelIcon className="size-8" />
				</div>
				<div>
					<h1 className="text-xl font-semibold">
						{t("onboardingSettings.title")}
					</h1>
					<p className="leading-snug text-neutral-600 dark:text-neutral-400">
						{t("onboardingSettings.subtitle")}
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-3">
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-white/10">
						<div className="flex-1">
							<h3 className="font-semibold">Push Notification</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Enabling push notifications will allow you to receive
								notifications from Lume.
							</p>
						</div>
						<Switch.Root
							checked={newSettings.notification}
							onClick={() => toggleNofitication()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/20"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-white/10">
						<div className="flex-1">
							<h3 className="font-semibold">Enhanced Privacy</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Lume will display external resources like image, video or link
								preview as plain text.
							</p>
						</div>
						<Switch.Root
							checked={newSettings.enhancedPrivacy}
							onClick={() => toggleEnhancedPrivacy()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/20"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-white/10">
						<div className="flex-1">
							<h3 className="font-semibold">Auto Update</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Automatically download and install new version.
							</p>
						</div>
						<Switch.Root
							checked={newSettings.autoUpdate}
							onClick={() => toggleAutoUpdate()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/20"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-white/10">
						<div className="flex-1">
							<h3 className="font-semibold">Zap</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								Show the Zap button in each note and user's profile screen, use
								for send Bitcoin tip to other users.
							</p>
						</div>
						<Switch.Root
							checked={newSettings.zap}
							onClick={() => toggleZap()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/20"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 px-5 py-4 dark:bg-white/10">
						<div className="flex-1">
							<h3 className="font-semibold">Filter sensitive content</h3>
							<p className="text-sm text-neutral-700 dark:text-neutral-300">
								By default, Lume will display all content which have Content
								Warning tag, it's may include NSFW content.
							</p>
						</div>
						<Switch.Root
							checked={newSettings.nsfw}
							onClick={() => toggleNsfw()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-white/20"
						>
							<Switch.Thumb className="block size-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
					</div>
				</div>
				<button
					type="button"
					onClick={() => submit()}
					disabled={loading}
					className="mb-1 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
				>
					{t("global.continue")}
				</button>
			</div>
		</div>
	);
}

function Pending() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<button type="button" className="size-5" disabled>
				<Spinner className="size-5" />
			</button>
		</div>
	);
}
