import { User } from "@app/auth/components/user";
import { Button } from "@shared/button";
import { LoaderIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { setToArray } from "@utils/transform";
import { useContext, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const ndk = useContext(RelayContext);

	const [loading, setLoading] = useState(false);
	const [account, updateFollows] = useActiveAccount((state: any) => [
		state.account,
		state.updateFollows,
	]);

	const submit = async () => {
		// show loading indicator
		setLoading(true);

		try {
			const user = ndk.getUser({ hexpubkey: account.pubkey });
			const follows = await user.follows();

			// follows as list
			const followsList = setToArray(follows);

			// update account follows in store
			updateFollows(followsList);

			// redirect to onboarding
			setTimeout(
				() => navigate("/app/onboarding", { overwriteLastHistoryEntry: true }),
				2000,
			);
		} catch {
			console.log("error");
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold">
						{loading ? "Creating..." : "Continue with"}
					</h1>
				</div>
				<div className="w-full rounded-xl border-t border-zinc-800/50 bg-zinc-900 p-4">
					{!account ? (
						<div className="w-full">
							<div className="flex items-center gap-2">
								<div className="h-11 w-11 animate-pulse rounded-lg bg-zinc-800" />
								<div>
									<h3 className="mb-1 h-4 w-16 animate-pulse rounded bg-zinc-800" />
									<p className="h-3 w-36 animate-pulse rounded bg-zinc-800" />
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<User pubkey={account.pubkey} />
							<Button preset="large" onClick={() => submit()}>
								{loading ? (
									<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
								) : (
									"Continue →"
								)}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
