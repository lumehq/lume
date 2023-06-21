import { Button } from "@shared/button";
import { EyeOffIcon, EyeOnIcon } from "@shared/icons";
import { useActiveAccount } from "@stores/accounts";
import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import { useMemo, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const createAccount = useActiveAccount((state: any) => state.create);

	const [type, setType] = useState("password");
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

	const submit = async () => {
		createAccount(npub, pubkey, privkey, null, 1);
		navigate("/app/auth/create/step-2");
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-100">
						Lume is auto-generated key for you
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-base font-semibold text-zinc-400">
							Public Key
						</label>
						<input
							readOnly
							value={npub}
							className="relative w-full rounded-lg py-3 pl-3.5 pr-11 !outline-none placeholder:text-zinc-400 bg-zinc-800 text-zinc-100"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-base font-semibold text-zinc-400">
							Private Key
						</label>
						<div className="relative">
							<input
								readOnly
								type={type}
								value={nsec}
								className="relative w-full rounded-lg py-3 pl-3.5 pr-11 !outline-none placeholder:text-zinc-400 bg-zinc-800 text-zinc-100"
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
										className="text-zinc-500 group-hover:text-zinc-100"
									/>
								) : (
									<EyeOnIcon
										width={20}
										height={20}
										className="text-zinc-500 group-hover:text-zinc-100"
									/>
								)}
							</button>
						</div>
					</div>
					<Button preset="large" onClick={() => submit()}>
						Continue →
					</Button>
				</div>
			</div>
		</div>
	);
}
