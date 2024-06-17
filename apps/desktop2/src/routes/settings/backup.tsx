import { User } from "@/components/user";
import { NostrAccount } from "@lume/system";
import { displayNpub, displayNsec } from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useState } from "react";
import { toast } from "sonner";

interface Account {
	npub: string;
	nsec: string;
}

export const Route = createFileRoute("/settings/backup")({
	beforeLoad: async () => {
		const accounts = await NostrAccount.getAccounts();
		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const { accounts } = Route.useRouteContext();

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col gap-3 divide-y divide-neutral-300 dark:divide-neutral-700">
				{accounts.map((account) => (
					<Account key={account} account={account} />
				))}
			</div>
		</div>
	);
}

function Account({ account }: { account: string }) {
	const [copied, setCopied] = useState(false);

	const copyKey = async () => {
		try {
			const data: string = await invoke("get_private_key", { npub: account });
			await writeText(data);
			setCopied(true);
		} catch (e) {
			toast.error(e);
		}
	};

	return (
		<div className="flex items-center justify-between gap-2 py-3">
			<User.Provider pubkey={account}>
				<User.Root className="flex items-center gap-2">
					<User.Avatar className="object-cover rounded-full size-8" />
					<div className="flex flex-col">
						<User.Name className="text-sm leading-tight" />
						<span className="text-sm leading-tight text-black/50 dark:text-white/50">
							{displayNpub(account, 16)}
						</span>
					</div>
				</User.Root>
			</User.Provider>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => copyKey()}
					className="inline-flex items-center justify-center h-8 text-sm font-medium rounded-md w-36 bg-neutral-200 hover:bg-neutral-300 dark:bg-white/10 dark:hover:bg-white/20"
				>
					{copied ? "Copied" : "Copy Private Key"}
				</button>
			</div>
		</div>
	);
}
