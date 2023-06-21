import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Button } from "@shared/button";
import { LoaderIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { Body, fetch } from "@tauri-apps/api/http";
import { useContext, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const ndk = useContext(RelayContext);
	const [account, tempProfile] = useActiveAccount((state: any) => [
		state.account,
		state.tempProfile,
	]);

	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);

	const createNIP05 = async () => {
		try {
			setLoading(true);

			const response = await fetch("https://lume.nu/api/user-create", {
				method: "POST",
				timeout: 30,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
				body: Body.json({
					username: username,
					pubkey: account.pubkey,
					lightningAddress: "",
				}),
			});

			if (response.ok) {
				const profile = { ...tempProfile, nip05: `${username}@lume.nu` };

				const signer = new NDKPrivateKeySigner(account.privkey);
				ndk.signer = signer;

				const event = new NDKEvent(ndk);
				// build event
				event.content = JSON.stringify(profile);
				event.kind = 0;
				event.pubkey = account.pubkey;
				event.tags = [];
				// publish event
				event.publish();

				// redirect to step 4
				navigate("/app/auth/create/step-4", {
					overwriteLastHistoryEntry: true,
				});
			}
		} catch (error) {
			setLoading(false);
			console.error("Error:", error);
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold text-zinc-100">
						Create your Lume ID
					</h1>
				</div>
				<div className="w-full flex flex-col justify-center items-center gap-4">
					<div className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800">
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoCapitalize="false"
							autoCorrect="none"
							spellCheck="false"
							placeholder="satoshi"
							className="relative w-full py-3 pl-3.5 !outline-none placeholder:text-zinc-500 bg-transparent text-zinc-100"
						/>
						<span className="text-fuchsia-500 font-semibold pr-3.5">
							@lume.nu
						</span>
					</div>
					<Button
						preset="large"
						onClick={() => createNIP05()}
						disabled={username.length === 0}
					>
						{loading ? (
							<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
						) : (
							"Continue →"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
