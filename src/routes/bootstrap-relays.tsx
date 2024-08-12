import { Spinner } from "@/components";
import { CancelIcon, PlusIcon } from "@/components";
import { NostrQuery } from "@/system";
import type { Relay } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/bootstrap-relays")({
	loader: async () => {
		const bootstrapRelays = await NostrQuery.getBootstrapRelays();
		return bootstrapRelays;
	},
	component: Screen,
});

function Screen() {
	const bootstrapRelays = Route.useLoaderData();
	const { register, reset, handleSubmit } = useForm();

	const [relays, setRelays] = useState<Relay[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const removeRelay = (url: string) => {
		setRelays((prev) => prev.filter((relay) => relay.url !== url));
	};

	const onSubmit = async (data: { url: string; purpose: string }) => {
		try {
			if (!data.url.startsWith("wss://") || !data.url.startsWith("ws://")) {
				return await message("Relay must be starts with wss:// or ws://", {
					title: "Bootstrap Relays",
					kind: "info",
				});
			}

			const relay: Relay = { url: data.url, purpose: data.purpose };
			setRelays((prev) => [...prev, relay]);
			reset();
		} catch (e) {
			await message(String(e), { title: "Bootstrap Relays", kind: "error" });
		}
	};

	const save = async () => {
		try {
			setIsLoading(true);
			await NostrQuery.saveBootstrapRelays(relays);
		} catch (e) {
			await message(String(e), { title: "Bootstrap Relays", kind: "error" });
		}
	};

	useEffect(() => {
		setRelays(bootstrapRelays);
	}, [bootstrapRelays]);

	return (
		<div
			data-tauri-drag-region
			className="relative flex flex-col items-center justify-between w-full h-full"
		>
			<div
				data-tauri-drag-region
				className="absolute top-0 left-0 h-14 w-full"
			/>
			<div className="flex items-end justify-center flex-1 w-full px-4 pb-4">
				<div className="text-center">
					<h2 className="text-xl font-semibold">Customize Bootstrap Relays</h2>
				</div>
			</div>
			<div className="flex flex-col items-center flex-1 w-full">
				<div className="flex flex-col w-full max-w-sm mx-auto p-3 overflow-hidden bg-white divide-y divide-neutral-100 dark:divide-white/5 rounded-xl shadow-primary dark:bg-white/10 dark:ring-1 ring-white/15">
					{relays.map((relay) => (
						<div
							key={relay.url}
							className="flex items-center justify-between h-11"
						>
							<div className="inline-flex items-center gap-2 text-sm font-medium">
								{relay.url}
							</div>
							<div className="flex items-center gap-2">
								{relay.purpose?.length ? (
									<button
										type="button"
										className="inline-flex items-center justify-center px-2 text-xs font-medium uppercase rounded-md h-7 w-max hover:bg-black/10 dark:hover:bg-white/10"
									>
										{relay.purpose}
									</button>
								) : null}
								<button
									type="button"
									onClick={() => removeRelay(relay.url)}
									className="inline-flex items-center justify-center rounded-md size-7 text-neutral-700 dark:text-white/20 hover:bg-black/10 dark:hover:bg-white/10"
								>
									<CancelIcon className="size-3" />
								</button>
							</div>
						</div>
					))}
					<div className="flex items-center border-t h-14 border-neutral-100 dark:border-white/5">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex items-center w-full gap-2 mb-0"
						>
							<div className="flex items-center flex-1 gap-2 border rounded-lg border-neutral-300 dark:border-white/20">
								<input
									{...register("url", {
										required: true,
										minLength: 1,
									})}
									name="url"
									placeholder="wss://..."
									spellCheck={false}
									className="flex-1 px-3 bg-transparent border-none rounded-l-lg h-9 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
								/>
								<select
									{...register("purpose")}
									className="flex-1 p-0 m-0 text-sm bg-transparent border-none outline-none h-9 ring-0 focus:outline-none focus:ring-0"
								>
									<option value="read">Read</option>
									<option value="write">Write</option>
									<option value="">Both</option>
								</select>
							</div>
							<button
								type="submit"
								className="inline-flex items-center justify-center px-2 text-sm font-medium text-white rounded-lg shrink-0 h-9 w-14 bg-black/20 dark:bg-white/20 hover:bg-blue-500 disabled:opacity-50"
							>
								<PlusIcon className="size-7" />
							</button>
						</form>
					</div>
				</div>
				<div className="w-full max-w-sm mx-auto">
					<button
						type="button"
						onClick={() => save()}
						disabled={isLoading}
						className="inline-flex items-center justify-center w-full h-9 mt-4 text-sm font-semibold text-white bg-blue-500 rounded-lg shrink-0 hover:bg-blue-600 disabled:opacity-50"
					>
						{isLoading ? <Spinner /> : "Save & Relaunch"}
					</button>
				</div>
			</div>
			<div className="flex-1" />
		</div>
	);
}
