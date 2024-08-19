import { commands } from "@/commands.gen";
import { Frame } from "@/components/frame";
import { Spinner } from "@/components/spinner";
import { Plus, X } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { useEffect, useState, useTransition } from "react";

export const Route = createLazyFileRoute("/bootstrap-relays")({
	component: Screen,
});

function Screen() {
	const bootstrapRelays = Route.useLoaderData();

	const [relays, setRelays] = useState<string[]>([]);
	const [newRelay, setNewRelay] = useState("");
	const [isPending, startTransition] = useTransition();

	const add = () => {
		try {
			let url = newRelay;

			if (!url.startsWith("wss://")) {
				url = `wss://${url}`;
			}

			// Validate URL
			const relay = new URL(url);

			// Update
			setRelays((prev) => [...prev, relay.toString()]);
			setNewRelay("");
		} catch {
			message("URL is not valid.", { kind: "error" });
		}
	};

	const remove = (relay: string) => {
		setRelays((prev) => prev.filter((item) => item !== relay));
	};

	const submit = () => {
		startTransition(async () => {
			if (!relays.length) {
				await message("You need to add at least 1 relay", {
					title: "Manage Relays",
					kind: "info",
				});
				return;
			}

			const merged = relays.join("\r\n");
			const res = await commands.saveBootstrapRelays(merged);

			if (res.status === "ok") {
				return await relaunch();
			} else {
				await message(res.error, {
					title: "Manage Relays",
					kind: "error",
				});
				return;
			}
		});
	};

	useEffect(() => {
		setRelays(bootstrapRelays);
	}, [bootstrapRelays]);

	return (
		<div className="size-full flex items-center justify-center">
			<div className="w-[320px] flex flex-col gap-8">
				<div className="flex flex-col gap-1 text-center">
					<h1 className="leading-tight text-xl font-semibold">Manage Relays</h1>
					<p className="text-sm text-neutral-700 dark:text-neutral-300">
						This relays will be only use to get user's metadata.
					</p>
				</div>
				<div className="flex flex-col gap-3">
					<Frame
						className="flex flex-col gap-3 p-3 rounded-xl overflow-hidden"
						shadow
					>
						<div className="flex gap-2">
							<input
								name="relay"
								type="text"
								placeholder="ex: relay.nostr.net, ..."
								value={newRelay}
								onChange={(e) => setNewRelay(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") add();
								}}
								className="flex-1 px-3 rounded-lg h-9 bg-transparent border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
							/>
							<button
								type="submit"
								onClick={() => add()}
								className="inline-flex items-center justify-center size-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
							>
								<Plus className="size-5" />
							</button>
						</div>
						<div className="flex flex-col gap-2">
							{relays.map((relay) => (
								<div
									key={relay}
									className="flex items-center justify-between h-9 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-900"
								>
									<div className="text-sm font-medium">{relay}</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => remove(relay)}
											className="inline-flex items-center justify-center rounded-md size-7 text-neutral-700 dark:text-white/20 hover:bg-black/10 dark:hover:bg-white/10"
										>
											<X className="size-3" />
										</button>
									</div>
								</div>
							))}
						</div>
					</Frame>
					<div className="flex flex-col items-center gap-1">
						<button
							type="button"
							onClick={() => submit()}
							disabled={isPending || !relays.length}
							className="inline-flex items-center justify-center w-full h-9 text-sm font-semibold text-white bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 disabled:opacity-50"
						>
							{isPending ? <Spinner /> : "Save & Restart"}
						</button>
						<span className="mt-2 w-full text-sm text-neutral-600 dark:text-neutral-400 inline-flex items-center justify-center">
							Lume will relaunch after saving.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
