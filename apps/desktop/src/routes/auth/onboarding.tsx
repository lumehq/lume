import { useArk } from "@lume/ark";
import { InfoIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { FETCH_LIMIT } from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import * as Switch from "@radix-ui/react-switch";
import { useQueryClient } from "@tanstack/react-query";
import {
	isPermissionGranted,
	requestPermission,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function OnboardingScreen() {
	const ark = useArk();
	const storage = useStorage();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [apiKey, setAPIKey] = useState("");
	const [settings, setSettings] = useState({
		notification: false,
		lowPower: false,
		translation: false,
	});

	const toggleLowPower = async () => {
		await storage.createSetting("lowPower", String(+!settings.lowPower));
		setSettings((state) => ({ ...state, lowPower: !settings.lowPower }));
	};

	const toggleTranslation = async () => {
		await storage.createSetting("translation", String(+!settings.translation));
		setSettings((state) => ({ ...state, translation: !settings.translation }));
	};

	const toggleNofitication = async () => {
		await requestPermission();
		setSettings((state) => ({
			...state,
			notification: !settings.notification,
		}));
	};

	const completeAuth = async () => {
		if (settings.translation) {
			if (!apiKey.length)
				return toast.warning(
					"You need to provide Translate API if enable translation",
				);

			await storage.createSetting("translateApiKey", apiKey);
		}

		setLoading(true);

		// get account contacts
		await ark.getUserContacts();

		// refetch newsfeed
		await queryClient.prefetchInfiniteQuery({
			queryKey: ["timeline-9999"],
			initialPageParam: 0,
			queryFn: async ({
				signal,
				pageParam,
			}: {
				signal: AbortSignal;
				pageParam: number;
			}) => {
				const events = await ark.getInfiniteEvents({
					filter: {
						kinds: [NDKKind.Text, NDKKind.Repost],
						authors: ark.account.contacts,
					},
					limit: FETCH_LIMIT,
					pageParam,
					signal,
				});

				return events;
			},
		});

		navigate("/");
	};

	useEffect(() => {
		async function loadSettings() {
			// get notification permission
			const permissionGranted = await isPermissionGranted();
			setSettings((prev) => ({ ...prev, notification: permissionGranted }));

			// get other settings
			const data = await storage.getAllSettings();
			for (const item of data) {
				if (item.key === "lowPower")
					setSettings((prev) => ({
						...prev,
						lowPower: !!parseInt(item.value),
					}));

				if (item.key === "translation")
					setSettings((prev) => ({
						...prev,
						translation: !!parseInt(item.value),
					}));
			}
		}

		loadSettings();
	}, []);

	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="mx-auto flex w-full max-w-md flex-col gap-10">
				<div className="flex flex-col gap-1 text-center items-center">
					<h1 className="text-2xl font-semibold">
						You&apos;re almost ready to use Lume.
					</h1>
					<p className="text-lg font-medium leading-snug text-neutral-600 dark:text-neutral-500">
						Let&apos;s start personalizing your experience.
					</p>
				</div>
				<div className="flex flex-col gap-3">
					<div className="flex w-full items-start justify-between gap-4 rounded-xl px-5 py-4 bg-neutral-950">
						<Switch.Root
							checked={settings.notification}
							onClick={() => toggleNofitication()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full outline-none data-[state=checked]:bg-blue-500 bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-neutral-50 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold text-lg">Push notification</h3>
							<p className="text-neutral-500">
								Enabling push notifications will allow you to receive
								notifications from Lume.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-xl px-5 py-4 bg-neutral-950">
						<Switch.Root
							checked={settings.lowPower}
							onClick={() => toggleLowPower()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full outline-none data-[state=checked]:bg-blue-500 bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-neutral-50 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold text-lg">Low Power Mode</h3>
							<p className="text-neutral-500">
								Limited relay connection and hide all media, sustainable for low
								network environment.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-xl px-5 py-4 bg-neutral-950">
						<Switch.Root
							checked={settings.translation}
							onClick={() => toggleTranslation()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full outline-none data-[state=checked]:bg-blue-500 bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-neutral-50 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold text-lg">
								Translation (nostr.wine)
							</h3>
							<p className="text-neutral-500">
								Translate text to your preferred language, powered by Nostr
								Wine.
							</p>
						</div>
					</div>
					{settings.translation ? (
						<div className="flex flex-col w-full items-start justify-between gap-2 rounded-xl px-5 py-4 bg-neutral-950">
							<h3 className="font-semibold">Translate API Key</h3>
							<input
								type="password"
								spellCheck={false}
								value={apiKey}
								onChange={(e) => setAPIKey(e.target.value)}
								className="w-full text-xl border-transparent outline-none focus:outline-none focus:ring-0 focus:border-none h-11 rounded-lg ring-0 placeholder:text-neutral-600 bg-neutral-900"
							/>
						</div>
					) : null}
					<div className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm bg-blue-950 text-blue-300">
						<InfoIcon className="size-8" />
						<p>
							There are many more settings you can configure from the
							&quot;Settings&quot; screen. Be sure to visit it later.
						</p>
					</div>
					<button
						type="button"
						onClick={completeAuth}
						className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? (
							<LoaderIcon className="size-5 animate-spin" />
						) : (
							"Continue"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
