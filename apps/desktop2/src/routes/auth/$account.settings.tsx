import { LaurelIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import { Spinner } from "@lume/ui";
import * as Switch from "@radix-ui/react-switch";
import { createFileRoute } from "@tanstack/react-router";
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
	const { settings } = Route.useRouteContext();
	const { account } = Route.useParams();
	const { t } = useTranslation();

	const [newSettings, setNewSettings] = useState(settings);
	const [loading, setLoading] = useState(false);

	const navigate = Route.useNavigate();

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
		<div className="flex flex-col items-center justify-center w-full h-full gap-6 px-5 mx-auto xl:max-w-xl">
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="flex items-center justify-center text-teal-500 bg-teal-100 rounded-full size-20 dark:bg-teal-950">
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
					<div className="flex items-start justify-between w-full gap-4 px-5 py-4 rounded-lg bg-neutral-100 dark:bg-white/10">
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
					<div className="flex items-start justify-between w-full gap-4 px-5 py-4 rounded-lg bg-neutral-100 dark:bg-white/10">
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
					className="inline-flex items-center justify-center w-full mb-1 font-semibold text-white bg-blue-500 rounded-lg h-11 shrink-0 hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? <Spinner /> : t("global.continue")}
				</button>
			</div>
		</div>
	);
}

function Pending() {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<button type="button" className="size-5" disabled>
				<Spinner className="size-5" />
			</button>
		</div>
	);
}
