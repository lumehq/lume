import { createLazyFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createLazyFileRoute("/settings/zap")({
	component: Screen,
});

function Screen() {
	return (
		<div className="w-full max-w-xl mx-auto">
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
			await message(String(e), { title: "Zap", kind: "info" });
		}
	};

	return (
		<div className="flex items-start gap-6">
			<div className="text-sm font-medium w-36 shrink-0 text-end">
				Connection
			</div>
			<div className="flex-1">
				<div className="flex flex-col w-full gap-1">
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
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							onClick={() => connect()}
							className="inline-flex items-center justify-center w-24 text-sm font-medium rounded-lg h-9 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700"
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
			<div className="text-sm font-medium w-36 shrink-0 text-end">
				Default amount
			</div>
			<div className="flex-1">
				<div className="flex flex-col w-full gap-1">
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
							className="w-full px-3 bg-transparent rounded-lg h-9 border-neutral-300 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							className="inline-flex items-center justify-center w-24 text-sm font-medium rounded-lg h-9 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700"
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
