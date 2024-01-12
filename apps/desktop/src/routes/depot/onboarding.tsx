import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { delay } from "@lume/utils";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parse, stringify } from "smol-toml";
import { toast } from "sonner";

export function DepotOnboardingScreen() {
	const ark = useArk();
	const storage = useStorage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const launchDepot = async () => {
		try {
			setLoading(true);

			// get default config
			const defaultConfig = await resolveResource("resources/config.toml");
			const config = await readTextFile(defaultConfig);
			const parsedConfig = parse(config);

			// add current user to whitelist
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			parsedConfig.authorization["pubkey_whitelist"].push(ark.account.pubkey);

			// update new config
			const newConfig = stringify(parsedConfig);
			await writeTextFile(defaultConfig, newConfig);

			// launch depot
			await storage.launchDepot();
			await storage.createSetting("depot", "1");
			await delay(2000); // delay 2s to make sure depot is running

			// default depot url: ws://localhost:6090
			// #TODO: user can custom depot url
			const connect = await ark.connectDepot();

			if (connect) {
				toast.success("Your Depot is successfully launch.");
				setLoading(false);

				navigate("/depot/");
			}
		} catch (e) {
			toast.error(e);
		}
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-[inset_0_0_0.5px_1px_hsla(0,0%,100%,0.075),0_0_0_1px_hsla(0,0%,0%,0.05),0_0.3px_0.4px_hsla(0,0%,0%,0.02),0_0.9px_1.5px_hsla(0,0%,0%,0.045),0_3.5px_6px_hsla(0,0%,0%,0.09)]">
			<div className="flex flex-col items-center gap-8">
				<div className="text-center">
					<h1 className="mb-1 text-3xl font-semibold text-neutral-400 dark:text-neutral-600">
						Run your Personal Nostr Relay inside Lume
					</h1>
					<h2 className="text-4xl font-semibold">Your Relay, Your Control.</h2>
				</div>
				<div className="rounded-xl bg-blue-100 p-1.5 dark:bg-blue-900">
					<button
						type="button"
						onClick={launchDepot}
						className="inline-flex h-11 w-36 transform items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white active:translate-y-1"
					>
						{loading ? (
							<>
								<LoaderIcon className="h-5 w-5 animate-spin" />
								Launching...
							</>
						) : (
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="h-5 w-5"
								>
									<path
										fillRule="evenodd"
										d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
										clipRule="evenodd"
									/>
								</svg>
								Launch
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
