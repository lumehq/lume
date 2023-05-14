import EyeOffIcon from "@icons/eyeOff";
import EyeOnIcon from "@icons/eyeOn";

import { onboardingAtom } from "@stores/onboarding";

import { useSetAtom } from "jotai";
import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import { useMemo, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const [type, setType] = useState("password");
	const setOnboarding = useSetAtom(onboardingAtom);
	const privkey = useMemo(() => generatePrivateKey(), []);

	const pubkey = getPublicKey(privkey);
	const npub = nip19.npubEncode(pubkey);
	const nsec = nip19.nsecEncode(privkey);

	// toggle private key
	const showPrivateKey = () => {
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	};

	const submit = () => {
		setOnboarding((prev) => ({ ...prev, pubkey: pubkey, privkey: privkey }));
		navigate("/auth/create/step-2");
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-semibold text-zinc-200">
						Lume is auto-generated key for you
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-zinc-400">
							Public Key
						</label>
						<div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
							<input
								readOnly
								value={npub}
								className="relative w-full rounded-lg border border-black/5 px-3.5 py-2.5 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-zinc-400">
							Private Key
						</label>
						<div className="relative shrink-0 before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
							<input
								readOnly
								type={type}
								value={nsec}
								className="relative w-full rounded-lg border border-black/5 py-2.5 pl-3.5 pr-11 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-600"
							/>
							<button
								type="button"
								onClick={() => showPrivateKey()}
								className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
							>
								{type === "password" ? (
									<EyeOffIcon
										width={20}
										height={20}
										className="text-zinc-500 group-hover:text-zinc-200"
									/>
								) : (
									<EyeOnIcon
										width={20}
										height={20}
										className="text-zinc-500 group-hover:text-zinc-200"
									/>
								)}
							</button>
						</div>
					</div>
					<button
						type="button"
						onClick={() => submit()}
						className="w-full transform rounded-lg bg-fuchsia-500 px-3.5 py-2.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
					>
						<span>Continue →</span>
					</button>
				</div>
			</div>
		</div>
	);
}
