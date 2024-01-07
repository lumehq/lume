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
		notification: false,
	});

	const next = () => {
		if (!storage.account.contacts.length) return navigate("/auth/follow");
		return navigate("/auth/finish");
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
							checked={settings.autoupdate}
							onClick={() => toggleAutoupdate()}
							className="relative mt-1 h-7 w-12 shrink-0 cursor-default rounded-full outline-none data-[state=checked]:bg-blue-500 bg-neutral-800"
						>
							<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-neutral-50 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
						</Switch.Root>
						<div>
							<h3 className="text-lg font-semibold">
								Auto check for update on Login
							</h3>
							<p className="text-neutral-500">
								Keep Lume up to date with latest version, always have new
								features and bug free.
							</p>
						</div>
					</div>
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
					<div className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm bg-blue-950 text-blue-300">
						<InfoIcon className="size-8" />
						<p>
							There are many more settings you can configure from the
							&quot;Settings&quot; screen. Be sure to visit it later.
						</p>
					</div>
					<button
						type="button"
						onClick={next}
						className="inline-flex items-center justify-center w-full h-12 text-lg font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50"
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
}
