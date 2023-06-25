import { createAccount, createBlock } from "@libs/storage";
import { Button } from "@shared/button";
import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "@shared/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateStep1Screen() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [type, setType] = useState("password");
	const [loading, setLoading] = useState(false);

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

	const account = useMutation({
		mutationFn: (data: any) => {
			return createAccount(data.npub, data.pubkey, data.privkey, null, 1);
		},
		onSuccess: (data: any) => {
			queryClient.setQueryData(["currentAccount"], data);
		},
	});

	const submit = () => {
		setLoading(true);

		account.mutate({
			npub,
			pubkey,
			privkey,
			follows: null,
			is_active: 1,
		});

		// redirect to next step
		setTimeout(() => navigate("/auth/create/step-2", { replace: true }), 1200);
	};

	return (
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
					{loading ? (
						<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
					) : (
						"Continue →"
					)}
				</Button>
			</div>
		</div>
	);
}
