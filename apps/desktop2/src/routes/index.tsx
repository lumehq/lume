import { User } from "@/components/user";
import { PlusIcon, RelayIcon } from "@lume/icons";
import { NostrAccount } from "@lume/system";
import { Spinner } from "@lume/ui";
import { checkForAppUpdates, displayNpub } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		// Check for app updates
		// TODO: move this function to rust
		await checkForAppUpdates(true);

		// Get all accounts
		// TODO: use emit & listen
		const accounts = await NostrAccount.getAccounts();

		if (accounts.length < 1) {
			throw redirect({
				to: "/landing",
				replace: true,
			});
		}

		return { accounts };
	},
	component: Screen,
});

function Screen() {
	const navigate = Route.useNavigate();
	const context = Route.useRouteContext();

	const [loading, setLoading] = useState({ npub: "", status: false });

	const select = async (npub: string) => {
		try {
			setLoading({ npub, status: true });

			const status = await NostrAccount.loadAccount(npub);

			if (status) {
				return navigate({
					to: "/$account/home",
					params: { account: npub },
					replace: true,
				});
			}
		} catch (e) {
			setLoading({ npub: "", status: false });
			await message(String(e), {
				title: "Account",
				kind: "error",
			});
		}
	};

	const currentDate = new Date().toLocaleString("default", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	return (
		<div
			data-tauri-drag-region
			className="relative flex flex-col items-center justify-between w-full h-full"
		>
			<div
				data-tauri-drag-region
				className="absolute top-0 left-0 h-14 w-full"
			/>
			<div className="flex items-end justify-center flex-1 w-full px-4 pb-10">
				<div className="text-center">
					<h2 className="mb-1 text-lg text-neutral-700 dark:text-neutral-300">
						{currentDate}
					</h2>
					<h2 className="text-2xl font-semibold">Welcome back!</h2>
				</div>
			</div>
			<div className="flex flex-col items-center flex-1 w-full gap-3">
				<div className="flex flex-col w-full max-w-sm mx-auto overflow-hidden bg-white divide-y divide-neutral-100 dark:divide-white/5 rounded-xl shadow-primary backdrop-blur-lg dark:bg-white/10 dark:ring-1 ring-white/15">
					{context.accounts.map((account) => (
						<div
							key={account}
							onClick={() => select(account)}
							onKeyDown={() => select(account)}
							className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5"
						>
							<User.Provider pubkey={account}>
								<User.Root className="flex items-center gap-2.5 p-3">
									<User.Avatar className="rounded-full size-10" />
									<div className="inline-flex flex-col items-start">
										<User.Name className="max-w-[6rem] truncate font-medium leading-tight" />
										<span className="text-sm text-neutral-700 dark:text-neutral-300">
											{displayNpub(account, 16)}
										</span>
									</div>
								</User.Root>
							</User.Provider>
							<div className="inline-flex items-center justify-center size-10">
								{loading.npub === account ? (
									loading.status ? (
										<Spinner />
									) : null
								) : null}
							</div>
						</div>
					))}
					<Link
						to="/landing"
						className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5"
					>
						<div className="flex items-center gap-2.5 p-3">
							<div className="inline-flex items-center justify-center rounded-full size-10 bg-neutral-200 dark:bg-white/10">
								<PlusIcon className="size-5" />
							</div>
							<span className="max-w-[6rem] truncate text-sm font-medium leading-tight">
								Add account
							</span>
						</div>
					</Link>
				</div>
				<div className="w-full max-w-sm mx-auto">
					<Link
						to="/bootstrap-relays"
						className="inline-flex items-center justify-center w-full h-8 gap-2 px-2 text-xs font-medium rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-white/40"
					>
						<RelayIcon className="size-4" />
						Custom Bootstrap Relays
					</Link>
				</div>
			</div>
			<div className="flex-1" />
		</div>
	);
}
