import { useStorage } from "@lume/ark";
import { EyeOffIcon } from "@lume/icons";
import { nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

export function BackupSettingScreen() {
	const storage = useStorage();

	const [privkey, setPrivkey] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const removePrivkey = async () => {
		await storage.removePrivkey(storage.account.pubkey);
	};

	useEffect(() => {
		async function loadPrivkey() {
			const key = await storage.loadPrivkey(storage.account.pubkey);
			if (key) setPrivkey(key);
		}

		loadPrivkey();
	}, []);

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="mb-2 text-sm font-semibold">Private key</div>
			<div>
				{!privkey ? (
					<div className="inline-flex h-24 w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900">
						You&apos;ve stored private key on Lume
					</div>
				) : (
					<>
						<div className="relative">
							<input
								readOnly
								type={showPassword ? "text" : "password"}
								value={nip19.nsecEncode(privkey)}
								className="relative h-11 w-full resize-none rounded-lg border-none bg-neutral-200 py-1 pl-3 pr-11 text-neutral-900 !outline-none placeholder:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-950"
							>
								<EyeOffIcon className="h-4 w-4" />
							</button>
						</div>
						<button
							type="button"
							onClick={() => removePrivkey()}
							className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-red-200 px-6 font-medium text-red-500 hover:bg-red-500 hover:text-white focus:outline-none dark:hover:text-white"
						>
							Remove private key
						</button>
					</>
				)}
			</div>
		</div>
	);
}
