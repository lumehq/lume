import { CancelIcon, PlusIcon } from "@lume/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/relay")({
	loader: async ({ context }) => {
		const ark = context.ark;
		const relays = await ark.get_relays();

		return relays;
	},
	component: Screen,
});

function Screen() {
	const relayList = Route.useLoaderData();
	const [relays, setRelays] = useState(relayList.connected);

	const { ark } = Route.useRouteContext();
	const { register, reset, handleSubmit } = useForm();

	const onSubmit = async (data: { url: string }) => {
		try {
			const add = await ark.add_relay(data.url);
			if (add) {
				setRelays((prev) => [...prev, data.url]);
				reset();
			}
		} catch (e) {
			toast.error(String(e));
		}
	};

	return (
		<div className="mx-auto w-full max-w-xl">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h2 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">
						Connected Relays
					</h2>
					<div className="flex flex-col divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl px-3">
						{relays.map((relay) => (
							<div
								key={relay}
								className="flex justify-between items-center h-11"
							>
								<div className="inline-flex items-center gap-2 text-sm font-medium">
									<span className="relative flex size-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full size-2 bg-teal-500"></span>
									</span>
									{relay}
								</div>
								<div>
									<button
										type="button"
										className="inline-flex items-center justify-center size-7 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
									>
										<CancelIcon className="size-4" />
									</button>
								</div>
							</div>
						))}
						<div className="flex items-center h-14">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="w-full flex items-center gap-2 mb-0"
							>
								<input
									{...register("url", {
										required: true,
										minLength: 1,
									})}
									name="url"
									placeholder="wss://..."
									spellCheck={false}
									className="h-9 flex-1 rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-0 dark:border-neutral-700 dark:placeholder:text-neutral-400"
								/>
								<button
									type="submit"
									className="shrink-0 inline-flex h-9 w-16 px-2 items-center justify-center rounded-lg bg-black/20 dark:bg-white/20 font-medium text-sm text-white hover:bg-blue-500 disabled:opacity-50"
								>
									<PlusIcon className="size-7" />
								</button>
							</form>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">
						User Relays (NIP-65)
					</h2>
					<div className="flex flex-col py-2 bg-black/5 dark:bg-white/5 rounded-xl px-3">
						<p className="text-sm text-yellow-500">
							Lume will automatically connect to the user's relay list, but the
							manager function (like adding, removing, changing relay purpose)
							is not yet available.
						</p>
					</div>
					<div className="flex flex-col divide-y divide-black/10 dark:divide-white/10 bg-black/5 dark:bg-white/5 rounded-xl px-3">
						{relayList.read?.map((relay) => (
							<div
								key={relay}
								className="flex justify-between items-center h-11"
							>
								<div className="text-sm font-medium">{relay}</div>
								<div className="text-xs font-semibold">READ</div>
							</div>
						))}
						{relayList.write?.map((relay) => (
							<div
								key={relay}
								className="flex justify-between items-center h-11"
							>
								<div className="text-sm font-medium">{relay}</div>
								<div className="text-xs font-semibold">WRITE</div>
							</div>
						))}
						{relayList.both?.map((relay) => (
							<div
								key={relay}
								className="flex justify-between items-center h-11"
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
