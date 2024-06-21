import { CancelIcon, PlusIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/settings/relay")({
	loader: async () => {
		const relays = await NostrQuery.getRelays();
		return relays;
	},
	component: Screen,
});

function Screen() {
	const relayList = Route.useLoaderData();
	const { register, reset, handleSubmit } = useForm();

	const [relays, setRelays] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (data: { url: string }) => {
		try {
			setIsLoading(true);

			const add = await NostrQuery.connectRelay(data.url);

			if (add) {
				setRelays((prev) => [...prev, data.url]);
				setIsLoading(false);
				reset();
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), { title: "Relay", kind: "error" });
		}
	};

	useEffect(() => {
		setRelays(relayList.connected);
	}, [relayList]);

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Connected Relays
					</h2>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						{relays.map((relay) => (
							<div
								key={relay}
								className="flex items-center justify-between h-11"
							>
								<div className="inline-flex items-center gap-2 text-sm font-medium">
									<span className="relative flex size-2">
										<span className="absolute inline-flex w-full h-full bg-teal-400 rounded-full opacity-75 animate-ping" />
										<span className="relative inline-flex bg-teal-500 rounded-full size-2" />
									</span>
									{relay}
								</div>
								<div>
									<button
										type="button"
										onClick={() => NostrQuery.removeRelay(relay)}
										className="inline-flex items-center justify-center rounded-md size-7 hover:bg-black/10 dark:hover:bg-white/10"
									>
										<CancelIcon className="size-4" />
									</button>
								</div>
							</div>
						))}
						<div className="flex items-center h-14">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="flex items-center w-full gap-2 mb-0"
							>
								<input
									{...register("url", {
										required: true,
										minLength: 1,
									})}
									name="url"
									placeholder="wss://..."
									spellCheck={false}
									className="flex-1 px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-0 dark:border-neutral-700 dark:placeholder:text-neutral-400"
								/>
								<button
									type="submit"
									disabled={isLoading}
									className="inline-flex items-center justify-center w-16 px-2 text-sm font-medium text-white rounded-lg shrink-0 h-9 bg-black/20 dark:bg-white/20 hover:bg-blue-500 disabled:opacity-50"
								>
									<PlusIcon className="size-7" />
								</button>
							</form>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						User Relays (NIP-65)
					</h2>
					<div className="flex flex-col px-3 py-2 bg-black/5 dark:bg-white/5 rounded-xl">
						<p className="text-sm text-yellow-500">
							Lume will automatically connect to the user's relay list, but the
							manager function (like adding, removing, changing relay purpose)
							is not yet available.
						</p>
					</div>
					<div className="flex flex-col px-3 divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl">
						{relayList.read?.map((relay) => (
							<div
								key={relay}
								className="flex items-center justify-between h-11"
							>
								<div className="text-sm font-medium">{relay}</div>
								<div className="text-xs font-semibold">READ</div>
							</div>
						))}
						{relayList.write?.map((relay) => (
							<div
								key={relay}
								className="flex items-center justify-between h-11"
							>
								<div className="text-sm font-medium">{relay}</div>
								<div className="text-xs font-semibold">WRITE</div>
							</div>
						))}
						{relayList.both?.map((relay) => (
							<div
								key={relay}
								className="flex items-center justify-between h-11"
							>
								<div className="text-sm font-medium">{relay}</div>
								<div className="text-xs font-semibold">READ + WRITE</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
