import { useStorage } from "@lume/ark";
import { InfoIcon } from "@lume/icons";
import * as Switch from "@radix-ui/react-switch";
import {
	isPermissionGranted,
	requestPermission,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function OnboardingScreen() {
	const storage = useStorage();
	const navigate = useNavigate();

	const [settings, setSettings] = useState({
		autoupdate: false,
		outbox: false,
		notification: false,
	});

	const next = () => {
		if (!storage.account.contacts.length) return navigate("/auth/follow");
		return navigate("/auth/finish");
	};

	const toggleOutbox = async () => {
		await storage.createSetting("outbox", String(+!settings.outbox));
		// update state
		setSettings((prev) => ({ ...prev, outbox: !settings.outbox }));
	};

	const toggleAutoupdate = async () => {
		await storage.createSetting("autoupdate", String(+!settings.autoupdate));
		// update state
		setSettings((prev) => ({ ...prev, autoupdate: !settings.autoupdate }));
	};

	const toggleNofitication = async () => {
		await requestPermission();
		// update state
		setSettings((prev) => ({ ...prev, notification: !settings.notification }));
	};

	useEffect(() => {
		async function loadSettings() {
			const permissionGranted = await isPermissionGranted();
			setSettings((prev) => ({ ...prev, notification: permissionGranted }));

			const data = await storage.getAllSettings();
			if (!data) return;

			for (const item of data) {
				if (item.key === "autoupdate")
					setSettings((prev) => ({
						...prev,
						autoupdate: !!parseInt(item.value),
					}));

				if (item.key === "outbox")
					setSettings((prev) => ({
						...prev,
						outbox: !!parseInt(item.value),
					}));
			}
		}

		loadSettings();
	}, []);

	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="mx-auto flex w-full max-w-md flex-col gap-10">
				<div className="text-center">
					<h1 className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
						You&apos;re almost ready to use Lume.
					</h1>
					<h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
						Let&apos;s start personalizing your experience.
					</h2>
				</div>
				<div className="flex flex-col gap-3">
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
						<Switch.Root
							checked={settings.autoupdate}
							onClick={() => toggleAutoupdate()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold">Auto check for update on Login</h3>
							<p className="text-sm">
								Keep Lume up to date with latest version, always have new
								features and bug free.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
						<Switch.Root
							checked={settings.notification}
							onClick={() => toggleNofitication()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold">Push notification</h3>
							<p className="text-sm">
								Enabling push notifications will allow you to receive
								notifications from Lume directly on your device.
							</p>
						</div>
					</div>
					<div className="flex w-full items-start justify-between gap-4 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
						<Switch.Root
							checked={settings.outbox}
							onClick={() => toggleOutbox()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="font-semibold">Use Gossip model (recommended)</h3>
							<p className="text-sm">
								Automatically discover relays to connect based on the
								preferences of each author.
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 rounded-lg bg-blue-100 p-3 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
						<InfoIcon className="h-8 w-8" />
						<p>
							There are many more settings you can configure from the
							&quot;Settings&quot; screen. Be sure to visit it later.
						</p>
					</div>
					<button
						type="button"
						onClick={next}
						className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600"
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
}
