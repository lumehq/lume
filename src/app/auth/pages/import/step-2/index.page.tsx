import { User } from "@app/auth/components/user";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { METADATA_RELAY } from "@stores/constants";
import { nip02ToArray } from "@utils/transform";
import { useContext, useState } from "react";
import useSWRSubscription from "swr/subscription";
import { navigate } from "vite-plugin-ssr/client/router";

export function Page() {
	const pool: any = useContext(RelayContext);

	const [account, updateFollows] = useActiveAccount((state: any) => [
		state.account,
		state.updateFollows,
	]);
	const [loading, setLoading] = useState(false);
	const [follows, setFollows] = useState(null);

	useSWRSubscription(account ? ["follows", account.pubkey] : null, () => {
		const unsubscribe = pool.subscribe(
			[
				{
					kinds: [3],
					authors: [account.pubkey],
				},
			],
			METADATA_RELAY,
			(event: any) => {
				setFollows(event.tags);
			},
		);

		return () => {
			unsubscribe();
		};
	});

	const submit = () => {
		// show loading indicator
		setLoading(true);

		// follows as list
		const followsList = nip02ToArray(follows);

		// update account follows in store
		updateFollows(followsList);

		// redirect to home
		setTimeout(() => navigate("/", { overwriteLastHistoryEntry: true }), 2000);
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-xl font-semibold">
						{loading ? "Creating..." : "Continue with"}
					</h1>
				</div>
				<div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4">
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
							<button
								type="button"
								onClick={() => submit()}
								className="inline-flex h-10 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 px-3.5 font-medium text-white shadow-button hover:bg-fuchsia-600 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
							>
								{loading ? (
									<svg
										className="h-5 w-5 animate-spin text-black dark:text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
								) : (
									<span>Continue →</span>
								)}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
