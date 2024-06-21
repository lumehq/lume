import { NostrAccount } from "@lume/system";
import { Spinner } from "@lume/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createLazyFileRoute("/auth/remote")({
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();

	const [uri, setUri] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async () => {
		if (!uri.startsWith("bunker://")) {
			return await message(
				"You need to enter a valid Connect URI starts with bunker://",
				{ title: "Nostr Connect", kind: "info" },
			);
		}

		try {
			setLoading(true);

			const remoteAccount = await NostrAccount.connectRemoteAccount(uri);

			if (remoteAccount?.length) {
				navigate({ to: "/", replace: true });
			}
		} catch (e) {
			setLoading(false);
			await message(String(e), { title: "Nostr Connect", kind: "error" });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-6 px-5 mx-auto xl:max-w-xl">
			<div className="text-center">
				<h3 className="text-xl font-semibold">Continue with Nostr Connect</h3>
			</div>
			<div className="flex flex-col w-full gap-3">
				<div className="flex flex-col gap-1">
					<label
						htmlFor="uri"
						className="font-medium text-neutral-900 dark:text-neutral-100"
					>
						Connect URI
					</label>
					<input
						name="uri"
						type="text"
						placeholder="bunker://..."
						value={uri}
						onChange={(e) => setUri(e.target.value)}
						className="px-3 border-transparent rounded-lg h-11 bg-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:bg-white/10 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col items-center gap-1">
					<button
						type="button"
						onClick={() => submit()}
						disabled={loading}
						className="inline-flex items-center justify-center w-full mt-3 font-semibold text-white bg-blue-500 rounded-lg h-11 shrink-0 hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? <Spinner /> : "Login"}
					</button>
					{loading ? (
						<p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
							Waiting confirmation...
						</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
