import { commands } from "@/commands.gen";
import { isValidRelayUrl } from "@/commons";
import { Plus, X } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState, useTransition } from "react";

export const Route = createLazyFileRoute("/settings/relays")({
	component: Screen,
});

function Screen() {
	const { allRelays } = Route.useRouteContext();

	const [relays, setRelays] = useState<string[]>([]);
	const [newRelay, setNewRelay] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	const removeRelay = async (relay: string) => {
		const res = await commands.removeRelay(relay);

		if (res.status === "ok") {
			return res.data;
		} else {
			throw new Error(res.error);
		}
	};

	const addNewRelay = () => {
		startTransition(async () => {
			if (!isValidRelayUrl(newRelay)) {
				await message("Relay URL is not valid", { kind: "error" });
				return;
			}

			const res = await commands.connectRelay(newRelay);

			if (res.status === "ok") {
				setRelays((prev) => [...prev, newRelay]);
				setNewRelay("");
			} else {
				await message(res.error, { title: "Relay", kind: "error" });
				return;
			}
		});
	};

	useEffect(() => {
		if (allRelays) setRelays(allRelays);
	}, [allRelays]);

	return (
		<div className="w-full px-3 pb-3">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<div>
						<h2 className="text-sm font-semibold">Connected Relays</h2>
						<p className="text-sm text-neutral-500">
							Learn more about Relays{" "}
							<a
								href="https://nostr.how/en/relays"
								target="_blank"
								rel="noreferrer"
								className="text-blue-500 !underline"
							>
								here
							</a>
						</p>
					</div>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex items-center h-14">
							<div className="flex items-center w-full gap-2 mb-0">
								<input
									value={newRelay}
									onChange={(e) => setNewRelay(e.target.value)}
									name="url"
									placeholder="wss://..."
									disabled={isPending}
									spellCheck={false}
									className="flex-1 px-3 bg-transparent rounded-lg h-9 border-neutral-400/50 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-0 dark:border-neutral-800/50 dark:placeholder:text-neutral-400"
								/>
								<button
									type="button"
									disabled={isPending}
									onClick={() => addNewRelay()}
									className="inline-flex items-center justify-center w-16 px-2 text-sm font-medium text-white rounded-lg shrink-0 h-9 bg-black/20 dark:bg-white/20 hover:bg-blue-500 disabled:opacity-50"
								>
									<Plus className="size-5" />
								</button>
							</div>
						</div>
						{relays.map((relay) => (
							<div
								key={relay}
								className="flex items-center justify-between h-11"
							>
								<div className="inline-flex items-center gap-2 text-sm font-medium truncate">
									<span className="relative flex size-2">
										<span className="absolute inline-flex w-full h-full bg-teal-400 rounded-full opacity-75 animate-ping" />
										<span className="relative inline-flex bg-teal-500 rounded-full size-2" />
									</span>
									<span className="truncate">{relay}</span>
								</div>
								<button
									type="button"
									onClick={() => removeRelay(relay)}
									className="inline-flex items-center justify-center rounded-md size-7 text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5"
								>
									<X className="size-4" />
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
