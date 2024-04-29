import { createLazyFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/settings/zap")({
	component: Screen,
});

function Screen() {
	return (
		<div className="mx-auto w-full max-w-xl">
			<div className="flex flex-col gap-3 divide-y divide-neutral-300 dark:divide-neutral-700">
				<div className="flex flex-col gap-6 py-3">
					<Connection />
					<DefaultAmount />
				</div>
			</div>
		</div>
	);
}

function Connection() {
	const [uri, setUri] = useState("");

	const connect = async () => {
		try {
			await invoke("set_nwc", { uri });
		} catch (e) {
			toast.error(String(e));
		}
	};

	return (
		<div className="flex items-start gap-6">
			<div className="w-36 shrink-0 text-end font-medium text-sm">
				Connection
			</div>
			<div className="flex-1">
				<div className="flex w-full flex-col gap-1">
					<label
						htmlFor="nwc"
						className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
					>
						Nostr Wallet Connect
					</label>
					<div className="flex items-center gap-2">
						<input
							name="nwc"
							type="text"
							value={uri}
							onChange={(e) => setUri(e.target.value)}
							placeholder="nostrconnect://"
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							onClick={connect}
							className="inline-flex h-9 w-24 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700"
						>
							Connect
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function DefaultAmount() {
	return (
		<div className="flex items-start gap-6">
			<div className="w-36 shrink-0 text-end font-medium text-sm">
				Default amount
			</div>
			<div className="flex-1">
				<div className="flex w-full flex-col gap-1">
					<label
						htmlFor="amount"
						className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
					>
						Set default amount for quick zapping
					</label>
					<div className="flex items-center gap-2">
						<input
							name="amount"
							type="number"
							value={21}
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							className="inline-flex h-9 w-24 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700"
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
