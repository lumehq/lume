import { User } from "@/components/user";
import type { Account } from "@lume/types";
import { displayNsec } from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/backup")({
	component: Screen,
	loader: async ({ context }) => {
		const ark = context.ark;
		const npubs = await ark.get_accounts();

		const accounts: Account[] = [];

		for (const account of npubs) {
			const nsec: string = await invoke("get_stored_nsec", {
				npub: account.npub,
			});
			accounts.push({ ...account, nsec });
		}

		return accounts;
	},
});

function Screen() {
	const accounts = Route.useLoaderData();

	return (
		<div className="mx-auto w-full max-w-xl">
			<div className="flex flex-col gap-3 divide-y divide-neutral-300 dark:divide-neutral-700">
				{accounts.map((account) => (
					<NostrAccount key={account.npub} account={account} />
				))}
			</div>
		</div>
	);
}

function NostrAccount({ account }: { account: Account }) {
	const [key, setKey] = useState(account.nsec);
	const [copied, setCopied] = useState(false);
	const [passphase, setPassphase] = useState("");

	const encrypt = async () => {
		const encrypted: string = await invoke("get_encrypted_key", {
			npub: account.npub,
			password: passphase,
		});
		setKey(encrypted);
	};

	const copyKey = async () => {
		try {
			await writeText(key);
			setCopied(true);
		} catch (e) {
			toast.error(e);
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-2 py-3">
			<User.Provider pubkey={account.npub}>
				<User.Root className="flex items-center gap-2">
					<User.Avatar className="size-8 rounded-full object-cover" />
					<div className="flex flex-col">
						<User.Name className="text-sm leading-tight" />
						<User.NIP05 />
					</div>
				</User.Root>
			</User.Provider>
			<div className="flex flex-col gap-2">
				<div className="flex w-full flex-col gap-1">
					<label
						htmlFor="nsec"
						className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
					>
						Private Key
					</label>
					<div className="flex items-center gap-2">
						<input
							readOnly
							name="nsec"
							type="text"
							value={displayNsec(key, 36)}
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							onClick={() => copyKey()}
							className="inline-flex h-9 w-24 items-center justify-center rounded-lg bg-neutral-200 text-sm font-medium hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700"
						>
							{copied ? "Copied" : "Copy"}
						</button>
					</div>
				</div>
				<div className="flex w-full flex-col gap-1">
					<label
						htmlFor="passphase"
						className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
					>
						Set a passphase to secure your key
					</label>
					<div className="flex items-center gap-2">
						<input
							name="passphase"
							type="password"
							value={passphase}
							onChange={(e) => setPassphase(e.target.value)}
							className="h-9 w-full rounded-lg border-neutral-300 bg-transparent px-3 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
						<button
							type="button"
							onClick={() => encrypt()}
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
